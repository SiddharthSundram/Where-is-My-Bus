import ZAI from 'z-ai-web-dev-sdk';

export interface AIChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIChatCompletion {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

export interface AIPredictionResult {
  predicted_arrival: string;
  confidence: number;
  factors: string[];
}

export interface AIRouteOptimization {
  optimized_stops: any[];
  time_saved: number;
  fuel_saved: number;
  recommendations: string[];
}

export interface AIInsights {
  peak_hours: string[];
  popular_routes: string[];
  revenue_trends: string;
  recommendations: string[];
}

class AIService {
  private zai: any = null;
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      this.zai = await ZAI.create();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize AI service:', error);
      throw error;
    }
  }

  async chatCompletion(messages: AIChatMessage[]): Promise<AIChatCompletion> {
    await this.initialize();
    
    try {
      const completion = await this.zai.chat.completions.create({
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: 0.7,
        max_tokens: 1000
      });

      return completion;
    } catch (error) {
      console.error('Chat completion failed:', error);
      throw error;
    }
  }

  async predictBusArrival(
    busId: number, 
    stopId: number, 
    currentLocation?: { lat: number; lng: number },
    trafficConditions?: string,
    weather?: string
  ): Promise<AIPredictionResult> {
    await this.initialize();

    const systemPrompt = `You are an AI-powered bus arrival prediction system. 
    Analyze the provided data and predict bus arrival times with high accuracy.
    Consider factors like traffic, weather, historical data, and current conditions.
    Provide confidence levels and key factors affecting your prediction.`;

    const userPrompt = `Predict arrival time for bus ${busId} at stop ${stopId}.
    ${currentLocation ? `Current location: ${currentLocation.lat}, ${currentLocation.lng}` : ''}
    ${trafficConditions ? `Traffic conditions: ${trafficConditions}` : ''}
    ${weather ? `Weather: ${weather}` : ''}
    
    Please provide:
    1. Predicted arrival time (ISO format)
    2. Confidence level (0-1)
    3. Key factors affecting the prediction`;

    try {
      const completion = await this.chatCompletion([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);

      const response = completion.choices[0]?.message?.content || '';
      
      // Parse the response to extract structured data
      const lines = response.split('\n');
      const result: AIPredictionResult = {
        predicted_arrival: new Date(Date.now() + 15 * 60000).toISOString(), // Default 15 mins
        confidence: 0.85,
        factors: ['traffic_conditions', 'historical_data']
      };

      // Extract predicted arrival time
      const timeMatch = response.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
      if (timeMatch) {
        result.predicted_arrival = timeMatch[1];
      }

      // Extract confidence
      const confidenceMatch = response.match(/confidence[:\s]+(\d*\.?\d+)/i);
      if (confidenceMatch) {
        result.confidence = parseFloat(confidenceMatch[1]);
      }

      // Extract factors
      const factorsMatch = response.match(/factors?[:\s]+(.+?)(?=\n\n|$)/i);
      if (factorsMatch) {
        result.factors = factorsMatch[1].split(',').map(f => f.trim());
      }

      return result;
    } catch (error) {
      console.error('Bus arrival prediction failed:', error);
      throw error;
    }
  }

  async optimizeRoute(
    routeId: number,
    currentStops: any[],
    trafficData?: any,
    passengerData?: any
  ): Promise<AIRouteOptimization> {
    await this.initialize();

    const systemPrompt = `You are an AI-powered route optimization expert for public transportation.
    Analyze the current route and provide optimization recommendations to improve efficiency,
    reduce travel time, and enhance passenger experience.`;

    const userPrompt = `Optimize route ${routeId} with the following data:
    Current stops: ${JSON.stringify(currentStops)}
    ${trafficData ? `Traffic data: ${JSON.stringify(trafficData)}` : ''}
    ${passengerData ? `Passenger data: ${JSON.stringify(passengerData)}` : ''}
    
    Please provide:
    1. Optimized stop order
    2. Estimated time saved (minutes)
    3. Estimated fuel saved (liters)
    4. Specific recommendations for improvement`;

    try {
      const completion = await this.chatCompletion([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);

      const response = completion.choices[0]?.message?.content || '';
      
      const result: AIRouteOptimization = {
        optimized_stops: currentStops, // Default to current stops
        time_saved: 15,
        fuel_saved: 5.2,
        recommendations: ['Consider adding express service', 'Optimize stop spacing']
      };

      // Extract time saved
      const timeMatch = response.match(/time\s+saved[:\s]+(\d*\.?\d+)\s*minutes?/i);
      if (timeMatch) {
        result.time_saved = parseFloat(timeMatch[1]);
      }

      // Extract fuel saved
      const fuelMatch = response.match(/fuel\s+saved[:\s]+(\d*\.?\d+)\s*liters?/i);
      if (fuelMatch) {
        result.fuel_saved = parseFloat(fuelMatch[1]);
      }

      // Extract recommendations
      const recommendationsMatch = response.match(/recommendations?[:\s]+(.+?)(?=\n\n|$)/i);
      if (recommendationsMatch) {
        result.recommendations = recommendationsMatch[1]
          .split('\n')
          .map(r => r.replace(/^[-*•]\s*/, '').trim())
          .filter(r => r.length > 0);
      }

      return result;
    } catch (error) {
      console.error('Route optimization failed:', error);
      throw error;
    }
  }

  async generateBusinessInsights(
    analyticsData: {
      total_buses: number;
      active_routes: number;
      daily_bookings: number;
      revenue: number;
      user_growth: string;
      on_time_performance: string;
    }
  ): Promise<AIInsights> {
    await this.initialize();

    const systemPrompt = `You are an AI business analyst specializing in public transportation.
    Analyze the provided analytics data and generate actionable insights for business improvement.`;

    const userPrompt = `Analyze the following transportation analytics data:
    - Total buses: ${analyticsData.total_buses}
    - Active routes: ${analyticsData.active_routes}
    - Daily bookings: ${analyticsData.daily_bookings}
    - Revenue: ₹${analyticsData.revenue}
    - User growth: ${analyticsData.user_growth}
    - On-time performance: ${analyticsData.on_time_performance}
    
    Please provide:
    1. Peak hours analysis
    2. Most popular routes
    3. Revenue trend analysis
    4. Strategic recommendations`;

    try {
      const completion = await this.chatCompletion([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);

      const response = completion.choices[0]?.message?.content || '';
      
      const result: AIInsights = {
        peak_hours: ['08:00-09:00', '17:00-18:00'],
        popular_routes: ['Route 1', 'Route 5'],
        revenue_trends: '+15% growth',
        recommendations: ['Increase buses on Route 1', 'Add express service']
      };

      // Extract peak hours
      const peakMatch = response.match(/peak\s+hours?[:\s]+(.+?)(?=\n\n|$)/i);
      if (peakMatch) {
        result.peak_hours = peakMatch[1]
          .split('\n')
          .map(h => h.replace(/^[-*•]\s*/, '').trim())
          .filter(h => h.length > 0);
      }

      // Extract popular routes
      const routesMatch = response.match(/popular\s+routes?[:\s]+(.+?)(?=\n\n|$)/i);
      if (routesMatch) {
        result.popular_routes = routesMatch[1]
          .split('\n')
          .map(r => r.replace(/^[-*•]\s*/, '').trim())
          .filter(r => r.length > 0);
      }

      // Extract revenue trends
      const revenueMatch = response.match(/revenue\s+trends?[:\s]+(.+?)(?=\n\n|$)/i);
      if (revenueMatch) {
        result.revenue_trends = revenueMatch[1].trim();
      }

      // Extract recommendations
      const recommendationsMatch = response.match(/recommendations?[:\s]+(.+?)(?=\n\n|$)/i);
      if (recommendationsMatch) {
        result.recommendations = recommendationsMatch[1]
          .split('\n')
          .map(r => r.replace(/^[-*•]\s*/, '').trim())
          .filter(r => r.length > 0);
      }

      return result;
    } catch (error) {
      console.error('Business insights generation failed:', error);
      throw error;
    }
  }

  async generateCustomerSupportResponse(
    userQuery: string,
    context?: {
      userId?: string;
      bookingId?: string;
      busId?: string;
      issueType?: string;
    }
  ): Promise<string> {
    await this.initialize();

    const systemPrompt = `You are a helpful customer support assistant for a public transportation app.
    Provide accurate, friendly, and helpful responses to user queries.
    Be empathetic and solution-oriented.`;

    const contextStr = context ? `Context: ${JSON.stringify(context)}` : '';
    const userPrompt = `User query: ${userQuery}\n${contextStr}\n\nPlease provide a helpful response.`;

    try {
      const completion = await this.chatCompletion([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);

      return completion.choices[0]?.message?.content || 'I apologize, but I cannot process your request at the moment.';
    } catch (error) {
      console.error('Customer support response generation failed:', error);
      throw error;
    }
  }

  async generateImage(prompt: string, size: string = '1024x1024'): Promise<string> {
    await this.initialize();

    try {
      const response = await this.zai.images.generations.create({
        prompt: prompt,
        size: size
      });

      return response.data[0].base64;
    } catch (error) {
      console.error('Image generation failed:', error);
      throw error;
    }
  }

  async performWebSearch(query: string, numResults: number = 10): Promise<any[]> {
    await this.initialize();

    try {
      const searchResult = await this.zai.functions.invoke("web_search", {
        query: query,
        num: numResults
      });

      return searchResult;
    } catch (error) {
      console.error('Web search failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const aiService = new AIService();

// Export convenience functions
export const predictBusArrival = (...args: Parameters<typeof aiService.predictBusArrival>) => 
  aiService.predictBusArrival(...args);

export const optimizeRoute = (...args: Parameters<typeof aiService.optimizeRoute>) => 
  aiService.optimizeRoute(...args);

export const generateBusinessInsights = (...args: Parameters<typeof aiService.generateBusinessInsights>) => 
  aiService.generateBusinessInsights(...args);

export const generateCustomerSupportResponse = (...args: Parameters<typeof aiService.generateCustomerSupportResponse>) => 
  aiService.generateCustomerSupportResponse(...args);

export const generateImage = (...args: Parameters<typeof aiService.generateImage>) => 
  aiService.generateImage(...args);

export const performWebSearch = (...args: Parameters<typeof aiService.performWebSearch>) => 
  aiService.performWebSearch(...args);