const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5001';

export async function runQuery(nl) {
	const res = await fetch(`${API_BASE}/api/query`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ query: nl }),
	});
	return res.json();
}

export async function getSchema() {
	const res = await fetch(`${API_BASE}/api/schema`);
	return res.json();
}

