import React, { useState } from 'react';
import { Star, UploadCloud, MapPin, AlertTriangle } from 'lucide-react';

const ReportPage = () => {
  const [formData, setFormData] = useState({
    place_name: '',
    place_type: 'mall',
    user_rating: 0,
    ramp: false,
    elevator: false,
    accessible_toilet: false,
    handrails: false,
    resting_area: false,
    accessible_parking: false,
    automatic_doors: false,
    wide_entrance: false,
    emergency_alarm: false,
    non_slip_floor: false,
    lowered_counter: false,
    visual_assistance: false,
    description: '',
    violation_flag: false
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (file) {
        data.append('evidence', file);
      }

      const res = await fetch('/api/reports', {
        method: 'POST',
        body: data
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Failed to submit report", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRating = (r) => {
    setFormData(prev => ({ ...prev, user_rating: r }));
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 fill-current" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Thank you!</h2>
          <p className="text-green-700">Your report has been submitted successfully and will help make India more accessible.</p>
          <button 
            onClick={() => { setSubmitted(false); setFormData({...formData, place_name: '', description: '', user_rating: 0}); }}
            className="mt-6 btn-primary bg-green-600 hover:bg-green-700"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-textPrimary">Rate & Report an Issue</h1>
        <p className="mt-2 text-gray-600">Help the community by sharing the accessibility details of a place you recently visited.</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          <div className="space-y-6">
            
            {/* Location Details */}
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center border-b pb-2 mb-4">
                <MapPin className="w-5 h-5 mr-2 text-primary" />
                Location Details
              </h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Place Name</label>
                  <div className="mt-1">
                    <input type="text" name="place_name" required value={formData.place_name} onChange={handleChange} className="input-field px-3 py-2 border w-full" placeholder="E.g. Central Mall" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Place Type</label>
                  <div className="mt-1">
                    <select name="place_type" value={formData.place_type} onChange={handleChange} className="input-field px-3 py-2 border w-full">
                      <option value="mall">Mall</option>
                      <option value="hospital">Hospital</option>
                      <option value="transit">Transit / Railway</option>
                      <option value="bus stop">Bus Stop</option>
                      <option value="public space">Public Space</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Accessibility Checklist */}
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-2 mb-4 mt-8 flex items-center">
                <Star className="w-5 h-5 mr-2 text-accent" />
                Accessibility Features
              </h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
                <div className="flex space-x-2">
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star} type="button" onClick={() => handleRating(star)}
                      className={`p-1 focus:outline-none transition-colors ${formData.user_rating >= star ? 'text-warning' : 'text-gray-300'}`}
                    >
                      <Star className={`w-8 h-8 ${formData.user_rating >= star ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Group 1: Structural Access */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary text-sm uppercase tracking-wider">Structural Access</h4>
                  <div className="space-y-3">
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input id="ramp" name="ramp" type="checkbox" checked={formData.ramp} onChange={handleChange} className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="ramp" className="font-medium text-gray-700">Wheelchair Ramp</label>
                        <p className="text-xs text-gray-500">Smooth ramp access at entrance</p>
                      </div>
                    </div>
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input id="elevator" name="elevator" type="checkbox" checked={formData.elevator} onChange={handleChange} className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="elevator" className="font-medium text-gray-700">Functional Elevator</label>
                      </div>
                    </div>
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input id="wide_entrance" name="wide_entrance" type="checkbox" checked={formData.wide_entrance} onChange={handleChange} className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="wide_entrance" className="font-medium text-gray-700">Wide Entrances/Aisles</label>
                      </div>
                    </div>
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input id="automatic_doors" name="automatic_doors" type="checkbox" checked={formData.automatic_doors} onChange={handleChange} className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="automatic_doors" className="font-medium text-gray-700">Automatic Doors</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Group 2: Facilities & Comfort */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary text-sm uppercase tracking-wider">Facilities & Comfort</h4>
                  <div className="space-y-3">
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input id="accessible_toilet" name="accessible_toilet" type="checkbox" checked={formData.accessible_toilet} onChange={handleChange} className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="accessible_toilet" className="font-medium text-gray-700">Accessible Toilet</label>
                      </div>
                    </div>
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input id="handrails" name="handrails" type="checkbox" checked={formData.handrails} onChange={handleChange} className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="handrails" className="font-medium text-gray-700">Handrails</label>
                      </div>
                    </div>
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input id="resting_area" name="resting_area" type="checkbox" checked={formData.resting_area} onChange={handleChange} className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="resting_area" className="font-medium text-gray-700">Resting Areas/Seating</label>
                      </div>
                    </div>
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input id="lowered_counter" name="lowered_counter" type="checkbox" checked={formData.lowered_counter} onChange={handleChange} className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="lowered_counter" className="font-medium text-gray-700">Lowered Counters</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Group 3: Safety & Assistance */}
                <div className="space-y-4 md:col-span-2">
                  <h4 className="font-semibold text-primary text-sm uppercase tracking-wider">Safety & Assistance</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input id="emergency_alarm" name="emergency_alarm" type="checkbox" checked={formData.emergency_alarm} onChange={handleChange} className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="emergency_alarm" className="font-medium text-gray-700">Emergency Alarms/Call Buttons</label>
                      </div>
                    </div>
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input id="non_slip_floor" name="non_slip_floor" type="checkbox" checked={formData.non_slip_floor} onChange={handleChange} className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="non_slip_floor" className="font-medium text-gray-700">Non-slip Flooring</label>
                      </div>
                    </div>
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input id="visual_assistance" name="visual_assistance" type="checkbox" checked={formData.visual_assistance} onChange={handleChange} className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="visual_assistance" className="font-medium text-gray-700">Visual Assistance (High Contrast/Braille)</label>
                      </div>
                    </div>
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input id="accessible_parking" name="accessible_parking" type="checkbox" checked={formData.accessible_parking} onChange={handleChange} className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="accessible_parking" className="font-medium text-gray-700">Accessible Parking</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <div className="mt-1">
                <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="input-field border w-full px-3 py-2" placeholder="Describe your experience or any obstacles..." />
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg flex items-start">
              <div className="flex items-center h-5">
                <input id="violation_flag" name="violation_flag" type="checkbox" checked={formData.violation_flag} onChange={handleChange} className="focus:ring-warning h-4 w-4 text-warning border-gray-300 rounded" />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="violation_flag" className="font-medium text-orange-800 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1 inline" /> Flag as Government Violation
                </label>
                <p className="text-orange-600">Check this if it violates accessibility laws for public infrastructures.</p>
              </div>
            </div>

            {/* PDF Upload */}
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex flex-col items-center">
                <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                <h4 className="text-sm font-medium text-gray-900">Upload PDF Evidence</h4>
                <p className="text-xs text-gray-500 mb-4 text-center">Please upload any supporting photos or documents in PDF format.</p>
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                />
                {file && <p className="mt-2 text-xs text-accent font-medium">Selected: {file.name}</p>}
              </div>
            </div>

          </div>

          <div className="mt-8">
            <button type="submit" className="w-full btn-primary text-lg py-3">
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportPage;
