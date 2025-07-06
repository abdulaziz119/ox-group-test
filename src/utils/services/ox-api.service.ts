import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

export interface OxProfile {
  id: string;
  name: string;
  email?: string;
  // Add other profile fields as needed
}

export interface OxVariation {
  id: string;
  name: string;
  price: number;
  // Add other variation fields as needed
}

export interface OxVariationsResponse {
  data: OxVariation[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

@Injectable()
export class OxApiService {
  private getBaseUrl(subdomain: string): string {
    return `https://${subdomain}.ox-sys.com`;
  }

  private getHeaders(token: string) {
    return {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async validateToken(subdomain: string, token: string): Promise<OxProfile> {
    try {
      const url = `${this.getBaseUrl(subdomain)}/profile`;
      const response: AxiosResponse<OxProfile> = await axios.get(url, {
        headers: this.getHeaders(token),
        timeout: 10000, // 10 seconds timeout
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
      if (error.response?.status === 404) {
        throw new HttpException('Subdomain not found', HttpStatus.NOT_FOUND);
      }
      
      console.error('OX API validation error:', error.message);
      throw new HttpException(
        'Failed to validate token with OX API',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getVariations(
    subdomain: string,
    token: string,
    page: number = 1,
    size: number = 10,
  ): Promise<OxVariationsResponse> {
    try {
      if (size > 20) {
        throw new HttpException('Size cannot be greater than 20', HttpStatus.BAD_REQUEST);
      }

      const url = `${this.getBaseUrl(subdomain)}/variations`;
      const response: AxiosResponse<OxVariationsResponse> = await axios.get(url, {
        headers: this.getHeaders(token),
        params: {
          page,
          size,
        },
        timeout: 15000, // 15 seconds timeout
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
      if (error.response?.status === 403) {
        throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
      }
      if (error.response?.status === 404) {
        throw new HttpException('Variations not found', HttpStatus.NOT_FOUND);
      }

      console.error('OX API variations error:', error.message);
      throw new HttpException(
        'Failed to fetch variations from OX API',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}