"use client";

import { useState } from "react";
import { submitInquiry } from "@/app/actions/inquiry";
import Link from "next/link";

type Props = {
  destinations: any[];
  experiences: any[];
  vehicles: any[];
};

export function PlannerForm({ destinations, experiences, vehicles }: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    travelStart: "",
    travelEnd: "",
    durationNote: "",
    adults: 2,
    children: 0,
    travellerType: "Couple",
    destinationIds: [] as string[],
    experienceIds: [] as string[],
    vehicleCategory: "",
    accommodation: "",
    budgetRange: "",
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    country: "",
    preferredContact: "email",
    message: ""
  });

  const updateForm = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const toggleArrayItem = (key: 'destinationIds' | 'experienceIds', id: string) => {
    setFormData(prev => {
      const current = prev[key];
      if (current.includes(id)) {
        return { ...prev, [key]: current.filter(x => x !== id) };
      } else {
        return { ...prev, [key]: [...current, id] };
      }
    });
  };

  const nextStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => Math.min(s + 1, 7));
  };
  
  const prevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await submitInquiry(formData);
      if (res.success && 'reference' in res) {
        setSuccessRef(res.reference as string);
      } else if (!res.success && 'error' in res) {
        setError(res.error || "An error occurred.");
      }
    } catch (err) {
      setError("Network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (successRef) {
    return (
      <div className="bg-white p-10 rounded-xl shadow-sm text-center border border-gray-100">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">✓</div>
        <h2 className="text-3xl font-display font-semibold mb-4">Your journey request has been received.</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The Ceylon Elite Tours team will review your request and contact you shortly with a personalized travel proposal.
        </p>
        <div className="bg-gray-50 p-6 rounded-lg mb-8 inline-block text-left">
          <span className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Reference Number</span>
          <strong className="text-xl tracking-wider font-mono">{successRef}</strong>
        </div>
        <div>
          <Link href="/" className="text-black font-semibold hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-gray-100 h-1 w-full">
        <div className="bg-black h-1 transition-all duration-300" style={{ width: `${(step / 7) * 100}%` }}></div>
      </div>

      <div className="p-8 md:p-12">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-8 text-sm">
            {error}
          </div>
        )}

        {/* STEP 1: DATES */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-display font-semibold mb-6">When are you travelling?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Arrival</label>
                <input 
                  type="date" 
                  value={formData.travelStart}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => updateForm({ travelStart: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-black focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Departure</label>
                <input 
                  type="date" 
                  value={formData.travelEnd}
                  min={formData.travelStart || new Date().toISOString().split('T')[0]}
                  onChange={e => updateForm({ travelEnd: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-black focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Flexible Dates or Duration (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. Flexible by +/- 3 days, or just '10 days in December'"
                value={formData.durationNote}
                onChange={e => updateForm({ durationNote: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-black focus:border-black"
              />
            </div>
          </div>
        )}

        {/* STEP 2: WHO */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-display font-semibold mb-6">Who is travelling?</h2>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adults</label>
                <select 
                  value={formData.adults}
                  onChange={e => updateForm({ adults: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 rounded-md px-4 py-3"
                >
                  {[1,2,3,4,5,6,7,8,9,10,12,15,20].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Children (Under 12)</label>
                <select 
                  value={formData.children}
                  onChange={e => updateForm({ children: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 rounded-md px-4 py-3"
                >
                  {[0,1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Travel Group Type</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Couple', 'Family', 'Friends', 'Solo', 'Corporate', 'Other'].map(type => (
                  <button
                    key={type}
                    onClick={() => updateForm({ travellerType: type })}
                    className={`py-3 px-4 border rounded-md text-sm font-medium transition-colors ${
                      formData.travellerType === type 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DESTINATIONS */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-display font-semibold mb-2">Where would you like to go?</h2>
            <p className="text-gray-500 text-sm mb-6">Select the destinations you're most interested in visiting, or leave blank if you'd like our recommendations.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2">
              {destinations.map(dest => (
                <div 
                  key={dest.id}
                  onClick={() => toggleArrayItem('destinationIds', dest.id)}
                  className={`cursor-pointer p-4 border rounded-lg flex items-center gap-4 transition-colors ${
                    formData.destinationIds.includes(dest.id) 
                      ? 'border-black bg-gray-50 ring-1 ring-black' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {dest.heroImageId && (
                    <img src={dest.heroImageId} alt={dest.name} className="w-12 h-12 rounded object-cover" />
                  )}
                  <div>
                    <div className="font-medium">{dest.name}</div>
                    <div className="text-xs text-gray-500">{dest.region}</div>
                  </div>
                  {formData.destinationIds.includes(dest.id) && (
                    <div className="ml-auto text-black">✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: EXPERIENCES */}
        {step === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-display font-semibold mb-2">What interests you?</h2>
            <p className="text-gray-500 text-sm mb-6">Select the types of experiences you'd like us to include.</p>
            
            <div className="flex flex-wrap gap-3">
              {experiences.map(exp => (
                <button
                  key={exp.id}
                  onClick={() => toggleArrayItem('experienceIds', exp.id)}
                  className={`py-2 px-5 border rounded-full text-sm font-medium transition-colors ${
                    formData.experienceIds.includes(exp.id)
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {exp.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: STYLE */}
        {step === 5 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-display font-semibold mb-6">How would you like to travel?</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Preference</label>
              <select 
                value={formData.vehicleCategory}
                onChange={e => updateForm({ vehicleCategory: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-black focus:border-black"
              >
                <option value="">Any comfortable vehicle</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.category}>{v.category} - {v.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accommodation Preference</label>
              <select 
                value={formData.accommodation}
                onChange={e => updateForm({ accommodation: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-black focus:border-black"
              >
                <option value="">No preference / Let us recommend</option>
                <option value="Standard (3-4 Star)">Standard Comfort (3-4 Star)</option>
                <option value="Luxury (5 Star)">Luxury (5 Star)</option>
                <option value="Boutique & Heritage">Boutique & Heritage Properties</option>
                <option value="Ultra Luxury">Ultra Luxury / Private Villas</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Budget Range (Per Person)</label>
              <select 
                value={formData.budgetRange}
                onChange={e => updateForm({ budgetRange: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-black focus:border-black"
              >
                <option value="">Not sure yet</option>
                <option value="$1500 - $2500">$1,500 - $2,500</option>
                <option value="$2500 - $4000">$2,500 - $4,000</option>
                <option value="$4000 - $6000">$4,000 - $6,000</option>
                <option value="$6000+">$6,000+</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 6: CONTACT */}
        {step === 6 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-display font-semibold mb-2">Tell us about yourself</h2>
            <p className="text-gray-500 text-sm mb-6">Where should we send your personalized proposal?</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => updateForm({ name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-black focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => updateForm({ email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-black focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp / Phone</label>
                <input 
                  type="text" 
                  value={formData.whatsapp}
                  onChange={e => updateForm({ whatsapp: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-black focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country of Residence</label>
                <input 
                  type="text" 
                  value={formData.country}
                  onChange={e => updateForm({ country: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-black focus:border-black"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements or Additional Notes</label>
                <textarea 
                  rows={4}
                  value={formData.message}
                  onChange={e => updateForm({ message: e.target.value })}
                  placeholder="Dietary requirements, accessibility needs, or specific things you wish to see..."
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-black focus:border-black"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: REVIEW */}
        {step === 7 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-display font-semibold mb-6">Review your request</h2>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-4 text-sm border border-gray-100">
              <div className="grid grid-cols-3 gap-4 border-b border-gray-200 pb-4">
                <div className="text-gray-500">Traveller</div>
                <div className="col-span-2 font-medium">{formData.name} ({formData.email})</div>
              </div>
              <div className="grid grid-cols-3 gap-4 border-b border-gray-200 pb-4">
                <div className="text-gray-500">Travel Party</div>
                <div className="col-span-2 font-medium">{formData.adults} Adults, {formData.children} Children ({formData.travellerType})</div>
              </div>
              <div className="grid grid-cols-3 gap-4 border-b border-gray-200 pb-4">
                <div className="text-gray-500">Dates</div>
                <div className="col-span-2 font-medium">
                  {formData.travelStart} to {formData.travelEnd} 
                  {formData.durationNote && <span className="block text-gray-500 font-normal mt-1">Note: {formData.durationNote}</span>}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 border-b border-gray-200 pb-4">
                <div className="text-gray-500">Preferences</div>
                <div className="col-span-2">
                  <div className="font-medium">{formData.accommodation || 'Accommodation flexible'}</div>
                  <div className="font-medium text-gray-700">{formData.vehicleCategory || 'Vehicle flexible'}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-gray-500">Destinations</div>
                <div className="col-span-2">
                  {formData.destinationIds.length > 0 
                    ? destinations.filter(d => formData.destinationIds.includes(d.id)).map(d => d.name).join(', ')
                    : 'Open to recommendations'}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-100">
          {step > 1 ? (
            <button 
              onClick={prevStep}
              disabled={loading}
              className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
            >
              &larr; Back
            </button>
          ) : <div></div>}
          
          {step < 7 ? (
            <button 
              onClick={nextStep}
              className="bg-black text-white px-8 py-3 rounded text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Next Step
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={loading || !formData.name || !formData.email}
              className="bg-black text-white px-8 py-3 rounded text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Request My Journey"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
