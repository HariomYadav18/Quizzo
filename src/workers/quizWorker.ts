// Web Worker for offloading heavy array operations
self.onmessage = (e: MessageEvent) => {
  const { questions, topic, count } = e.data;
  
  // 1. Filter by topic
  let filtered = topic === 'All' 
    ? [...questions] 
    : questions.filter((q: any) => q.category === topic);

  // 2. High-performance Fisher-Yates shuffle
  for (let i = filtered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
  }

  // 3. Return the sliced payload back to the main thread
  self.postMessage(filtered.slice(0, count));
};