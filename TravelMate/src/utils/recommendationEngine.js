const ranges = { '₹5,000 – ₹10,000':[5,10], '₹10,000 – ₹20,000':[10,20], '₹20,000 – ₹30,000':[20,30], '₹30,000 – ₹50,000':[30,50], '₹50,000+':[50,100], '1–2 Days':[1,2], '3–4 Days':[3,4], '5–7 Days':[5,7], '8–10 Days':[8,10], '11–15 Days':[11,15], '15+ Days':[15,30] };
const parseRange = (value) => ranges[value] || [0, 100];
const overlap = (a,b) => Math.max(0, Math.min(a[1],b[1]) - Math.max(a[0],b[0]) + 1) / Math.max(a[1]-a[0]+1,b[1]-b[0]+1);
export function scoreDestination(destination, preferences) {
  const budgetScore = preferences.budget ? overlap(parseRange(preferences.budget), parseRange(destination.budgetRange)) * 20 : 10;
  const daysScore = preferences.days ? overlap(parseRange(preferences.days), parseRange(destination.durationRange)) * 20 : 10;
  const climateScore = preferences.climate ? (destination.climate === preferences.climate ? 20 : ['Pleasant','Warm'].includes(destination.climate) && ['Pleasant','Warm'].includes(preferences.climate) ? 10 : 0) : 10;
  const interestScore = preferences.interests?.length ? preferences.interests.filter((interest) => destination.interests.includes(interest)).length / preferences.interests.length * 25 : 12.5;
  const travelScore = preferences.travelType ? (destination.travelTypes.includes(preferences.travelType) ? 10 : 0) : 5;
  const stateScore = !preferences.state || preferences.state === 'Any State' ? 5 : destination.state === preferences.state ? 5 : 0;
  return Math.round(Math.min(100, budgetScore + daysScore + climateScore + interestScore + travelScore + stateScore));
}
export function getRecommendations(destinations, preferences) { return destinations.map((destination) => ({...destination, score: scoreDestination(destination, preferences)})).sort((a,b) => b.score - a.score).slice(0,5); }
export function matchLabel(score) { return score >= 90 ? 'Excellent Match' : score >= 80 ? 'Great Match' : score >= 70 ? 'Good Match' : score >= 60 ? 'Fair Match' : 'Possible Match'; }
