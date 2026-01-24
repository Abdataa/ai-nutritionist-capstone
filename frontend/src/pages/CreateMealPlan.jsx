import { useState } from 'react';
import { Loader, Sparkles, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import api from '../services/api';

export function CreateMealPlan({ onGenerate }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    goal: '',
    dietType: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    mealsPerDay: '3',
    allergies: '',
  });

  const handleGenerate = async () => {
    setError('');
    setIsGenerating(true);
    
    try {
      // First, register the client if they don't exist
      const clientData = {
        name: formData.clientName,
        email: formData.clientEmail,
        password: 'TempPassword123!',  // Temporary password
        role: 'user'
      };
      
      let clientCreated = false;
      // Try to register the client
      try {
        await api.post('/auth/register', clientData);
        clientCreated = true;
      } catch (regError) {
        // If user already exists, that's okay - we'll continue
        if (!regError.response?.data?.detail?.includes('already exists')) {
          throw regError;
        }
      }
      
      // If client was just created, log in as that client to create the meal plan
      // Otherwise, the meal plan will be created for the logged-in coach
      let originalToken = null;
      if (clientCreated) {
        // Save current coach token
        originalToken = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        // Login as the client
        const loginResponse = await api.post('/auth/login', {
          email: formData.clientEmail,
          password: 'TempPassword123!'
        });
        
        // Temporarily use client token
        localStorage.setItem('temp_client_token', loginResponse.data.access_token);
      }
      
      // Create the meal plan
      const mealPlanData = {
        goal: formData.goal,
        diet_type: formData.dietType,
        daily_calories: parseInt(formData.calories),
        macros: {
          protein: parseInt(formData.protein) || Math.round(parseInt(formData.calories) * 0.3 / 4),
          carbs: parseInt(formData.carbs) || Math.round(parseInt(formData.calories) * 0.4 / 4),
          fats: parseInt(formData.fats) || Math.round(parseInt(formData.calories) * 0.3 / 9)
        }
      };
      
      // Use client token if we just created them
      const config = clientCreated ? {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('temp_client_token')}`
        }
      } : {};
      
      const response = await api.post('/api/mealplan/', mealPlanData, config);
      console.log('Meal plan created:', response.data);
      
      // Restore original token if we switched
      if (originalToken) {
        if (localStorage.getItem('token')) {
          localStorage.setItem('token', originalToken);
        } else {
          sessionStorage.setItem('token', originalToken);
        }
        localStorage.removeItem('temp_client_token');
      }
      
      // Success - navigate to the meal plan view
      setTimeout(() => {
        setIsGenerating(false);
        onGenerate();
      }, 1000);
    } catch (err) {
      setIsGenerating(false);
      setError(err.response?.data?.detail || 'Failed to generate meal plan. Please try again.');
      console.error('Error generating meal plan:', err);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Meal Plan</h1>
        <p className="text-slate-600">Generate a personalized 7-day meal plan for your client using AI.</p>
      </div>

      <div className="max-w-3xl">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Client Information</CardTitle>
                <CardDescription>Enter your client's goals and preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 dark:bg-red-900/20 dark:border-red-900/30">
                <p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">
                  {error}
                </p>
              </div>
            )}

            {/* Client Name */}
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                placeholder="e.g., John Smith"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              />
            </div>

            {/* Client Email */}
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                type="email"
                placeholder="e.g., john@example.com"
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              />
              <p className="text-sm text-slate-500">
                Required for client account creation and meal plan delivery
              </p>
            </div>

            {/* Goal */}
            <div className="space-y-2">
              <Label htmlFor="goal">Fitness Goal</Label>
              <Select value={formData.goal} onValueChange={(value) => setFormData({ ...formData, goal: value })}>
                <SelectTrigger id="goal">
                  <SelectValue placeholder="Select a goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                  <SelectItem value="fat-loss">Fat Loss</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="athletic-performance">Athletic Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Diet Type */}
            <div className="space-y-2">
              <Label htmlFor="dietType">Dietary Type</Label>
              <Select value={formData.dietType} onValueChange={(value) => setFormData({ ...formData, dietType: value })}>
                <SelectTrigger id="dietType">
                  <SelectValue placeholder="Select diet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="keto">Keto</SelectItem>
                  <SelectItem value="paleo">Paleo</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="low-carb">Low Carb</SelectItem>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Calories */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calories">Daily Calorie Target</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="e.g., 2500"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mealsPerDay">Meals per Day</Label>
                <Select value={formData.mealsPerDay} onValueChange={(value) => setFormData({ ...formData, mealsPerDay: value })}>
                  <SelectTrigger id="mealsPerDay">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 meals</SelectItem>
                    <SelectItem value="4">4 meals</SelectItem>
                    <SelectItem value="5">5 meals</SelectItem>
                    <SelectItem value="6">6 meals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Macros (Optional) */}
            <div className="space-y-2">
              <Label>Macronutrients (Optional - Auto-calculated if left empty)</Label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="protein" className="text-xs">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    placeholder="Auto"
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="carbs" className="text-xs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    placeholder="Auto"
                    value={formData.carbs}
                    onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="fats" className="text-xs">Fats (g)</Label>
                  <Input
                    id="fats"
                    type="number"
                    placeholder="Auto"
                    value={formData.fats}
                    onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Allergies & Preferences */}
            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies & Food Preferences (Optional)</Label>
              <Textarea
                id="allergies"
                placeholder="e.g., No nuts, lactose intolerant, prefers chicken over beef..."
                rows={3}
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              />
              <p className="text-sm text-slate-500">
                Include any allergies, intolerances, or specific food preferences
              </p>
            </div>

            {/* Generate Button */}
            <div className="pt-4">
              <Button
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-12"
                onClick={handleGenerate}
                disabled={isGenerating || !formData.clientName || !formData.clientEmail || !formData.goal || !formData.dietType || !formData.calories}
              >
                {isGenerating ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5 mr-2" />
                    Generate Meal Plan with AI
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Info Card */}
        <Card className="mt-6 border-none bg-gradient-to-br from-blue-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">AI-Powered Intelligence</h4>
                <p className="text-sm text-slate-600">
                  Our AI analyzes your client's goals, dietary preferences, and calorie targets to create a perfectly balanced 7-day meal plan with complete macro breakdowns and grocery lists.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
