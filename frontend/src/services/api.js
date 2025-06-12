const API_URL = 'http://localhost:3001';

export async function cadastrarUsuario(dados) {
  const response = await fetch(`${API_URL}/cadastro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  return response.json();
}