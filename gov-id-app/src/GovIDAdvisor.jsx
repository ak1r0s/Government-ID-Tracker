import { useState } from "react";

const dependencies = [
  ["Student Permit", "Driver's License"],
  ["PhilSys ID", "Passport"],
  ["Barangay Clearance", "Police Clearance"],
  ["Police Clearance", "NBI Clearance"],
  ["PhilSys ID", "SSS ID"],
  ["Driver's License", "SSS ID"],
  ["Passport", "SSS ID"],
  ["PhilSys ID", "PhilHealth ID"],
  ["Barangay Clearance", "Postal ID"],
  ["SSS ID", "UMID"]
];

const GovIDAdvisor = () => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);

  const handleCheck = () => {
    const owned = new Set(input.split(",").map(i => i.trim()));

    const idToIndex = new Map();
    const indexToId = [];

    const addId = (id) => {
      if (!idToIndex.has(id)) {
        idToIndex.set(id, indexToId.length);
        indexToId.push(id);
      }
    };

    dependencies.forEach(([from, to]) => {
      addId(from);
      addId(to);
    });

    const n = indexToId.length;
    const adj = Array.from({ length: n }, () => []);
    dependencies.forEach(([from, to]) => {
      adj[idToIndex.get(from)].push(idToIndex.get(to));
    });

    const visited = Array(n).fill(false);
    const stack = [];

    const dfs = (v) => {
      visited[v] = true;
      for (const u of adj[v]) {
        if (!visited[u]) dfs(u);
      }
      stack.push(v);
    };

    for (let i = 0; i < n; i++) {
      if (!visited[i]) dfs(i);
    }

    const ownedIndices = new Set(
      Array.from(owned).map(id => idToIndex.get(id)).filter(i => i !== undefined)
    );
    const collected = new Set(ownedIndices);
    const next = [];

    while (stack.length) {
      const curr = stack.pop();
      if (ownedIndices.has(curr)) continue;

      let allMet = true;
      for (let i = 0; i < n; i++) {
        if (adj[i].includes(curr) && !collected.has(i)) {
          allMet = false;
          break;
        }
      }

      if (allMet) {
        next.push(indexToId[curr]);
        collected.add(curr);
      }
    }

    setResults(next);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Philippine Government ID Advisor</h1>
      <p className="text-sm text-gray-500">
        Enter your current government IDs separated by commas (e.g. PhilSys ID, Barangay Clearance)
      </p>
      <div className="flex gap-2">
        <input
          className="border p-2 rounded w-full"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. PhilSys ID, Passport"
        />
        <button onClick={handleCheck} className="bg-blue-500 text-white px-4 py-2 rounded">
          Check
        </button>
      </div>
      <div className="border rounded p-4 bg-white">
        {results.length === 0 ? (
          <p className="text-gray-500">No new IDs are currently available based on your input.</p>
        ) : (
          <ul className="list-disc pl-5 space-y-1">
            {results.map(id => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GovIDAdvisor;
