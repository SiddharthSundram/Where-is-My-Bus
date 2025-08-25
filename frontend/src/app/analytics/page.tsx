"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { useAnalytics, useFlaskAPI } from '@/components/flask-integration';
import { CSSShuttleBackground } from '@/components/shuttle-background';
import { 
  FaChartLine, 
  FaBus, 
  FaRoute, 
  FaUsers, 
  FaMoneyBillWave, 
  FaClock,
  FaBrain,
  FaLightbulb,
  FaSync
} from 'react-icons/fa';

export default function AnalyticsPage() {
  const { analytics, loading, error } = useAnalytics();
  const { optimizeRoute, predictArrival } = useFlaskAPI();
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState<any>(null);

  const handleOptimizeRoute = async () => {
    setAiLoading(true);
    try {
      const result = await optimizeRoute(1); // Example route ID
      setAiResults({ type: 'optimization', data: result });
    } catch (err) {
      console.error('Error optimizing route:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handlePredictArrival = async () => {
    setAiLoading(true);
    try {
      const result = await predictArrival(1, 1); // Example bus and stop IDs
      setAiResults({ type: 'prediction', data: result });
    } catch (err) {
      console.error('Error predicting arrival:', err);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Analytics</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Analytics Data Available</h2>
          <p className="text-muted-foreground">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <CSSShuttleBackground />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-sm px-4 py-2 bg-gradient-to-r from-slate-700/10 to-blue-700/10 border-slate-600/30 text-slate-300">
            <FaBrain className="mr-2" />
            AI-Powered Analytics
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Transportation Analytics
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real-time insights and AI-powered recommendations for your transportation network
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-slate-800/50 to-blue-800/50 border-slate-600/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Buses</CardTitle>
              <FaBus className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.analytics.total_buses}</div>
              <p className="text-xs text-slate-400">Active fleet</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-blue-800/50 border-slate-600/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Active Routes</CardTitle>
              <FaRoute className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.analytics.active_routes}</div>
              <p className="text-xs text-slate-400">Network coverage</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-blue-800/50 border-slate-600/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Daily Bookings</CardTitle>
              <FaUsers className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analytics.analytics.daily_bookings.toLocaleString()}</div>
              <p className="text-xs text-slate-400">Today's trips</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-blue-800/50 border-slate-600/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Revenue</CardTitle>
              <FaMoneyBillWave className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₹{analytics.analytics.revenue.toLocaleString()}</div>
              <p className="text-xs text-slate-400">Today's earnings</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-blue-800/50 border-slate-600/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">User Growth</CardTitle>
              <FaChartLine className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{analytics.analytics.user_growth}</div>
              <p className="text-xs text-slate-400">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-blue-800/50 border-slate-600/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">On-Time Performance</CardTitle>
              <FaClock className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{analytics.analytics.on_time_performance}</div>
              <p className="text-xs text-slate-400">Service reliability</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-slate-800/50 to-blue-800/50 border-slate-600/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-300">
                <FaBrain className="text-blue-400" />
                AI Insights
              </CardTitle>
              <CardDescription className="text-slate-400">
                Machine learning-powered analysis and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-slate-300 mb-2">Peak Hours</h4>
                <div className="flex flex-wrap gap-2">
                  {analytics.insights.peak_hours.map((hour, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-600/20 text-blue-300">
                      {hour}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-300 mb-2">Popular Routes</h4>
                <div className="flex flex-wrap gap-2">
                  {analytics.insights.popular_routes.map((route, index) => (
                    <Badge key={index} variant="secondary" className="bg-indigo-600/20 text-indigo-300">
                      {route}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-300 mb-2">Revenue Trends</h4>
                <Badge variant="outline" className="bg-green-600/20 text-green-300 border-green-600/30">
                  {analytics.insights.revenue_trends}
                </Badge>
              </div>

              <div>
                <h4 className="font-semibold text-slate-300 mb-2">Recommendations</h4>
                <ul className="space-y-2">
                  {analytics.insights.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <FaLightbulb className="text-yellow-400 mt-1 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-blue-800/50 border-slate-600/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-300">
                <FaSync className="text-blue-400" />
                AI Actions
              </CardTitle>
              <CardDescription className="text-slate-400">
                Perform AI-powered operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Button 
                  onClick={handleOptimizeRoute} 
                  disabled={aiLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <FaBrain className="mr-2" />
                  Optimize Route
                </Button>
                
                <Button 
                  onClick={handlePredictArrival} 
                  disabled={aiLoading}
                  variant="outline"
                  className="w-full border-slate-600/30 hover:border-slate-600/50"
                >
                  <FaClock className="mr-2" />
                  Predict Arrival Time
                </Button>
              </div>

              {aiLoading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-slate-400 mt-2">Processing AI request...</p>
                </div>
              )}

              {aiResults && (
                <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
                  <h4 className="font-semibold text-slate-300 mb-2">
                    {aiResults.type === 'optimization' ? 'Route Optimization Results' : 'Arrival Prediction Results'}
                  </h4>
                  <pre className="text-xs text-slate-400 overflow-x-auto">
                    {JSON.stringify(aiResults.data, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Real-time Status */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-blue-800/50 border-slate-600/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-300">
              <FaSync className="text-blue-400" />
              System Status
            </CardTitle>
            <CardDescription className="text-slate-400">
              Backend integration status and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-slate-300">Flask Backend</p>
                <p className="text-xs text-green-400">Connected</p>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-slate-300">Database</p>
                <p className="text-xs text-green-400">Operational</p>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-slate-300">AI Services</p>
                <p className="text-xs text-yellow-400">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}