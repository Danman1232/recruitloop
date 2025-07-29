// src/utils/stageHelpers.js
export function getStageColor(stage) {
  switch (stage) {
    case 'pending': return 'bg-yellow-400';
    case 'accepted': return 'bg-green-500';
    case 'phone_interview': return 'bg-green-600';
    case 'in_person': return 'bg-green-700';
    case 'offer_sent': return 'bg-blue-500';
    case 'offer_accepted': return 'bg-blue-600';
    case 'placed': return 'bg-blue-700';
    case 'declined': return 'bg-red-500';
    default: return 'bg-gray-300';
  }
}

export function formatStageLabel(stage) {
  return stage.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
