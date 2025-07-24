// Funções para codificar/decodificar IDs usando base64
export const encodeVideoId = (id: string): string => {
  try {
    // Adiciona um prefixo para tornar o hash mais único
    const prefixedId = `LP_${id}_VID`;
    return btoa(prefixedId)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  } catch (error) {
    console.error('Erro ao codificar ID:', error);
    return id;
  }
};

export const decodeVideoId = (encodedId: string): string | null => {
  try {
    // Restaura os caracteres base64
    let base64 = encodedId
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Adiciona padding se necessário
    while (base64.length % 4) {
      base64 += '=';
    }
    
    const decoded = atob(base64);
    
    // Verifica se tem o prefixo correto e extrai o ID
    if (decoded.startsWith('LP_') && decoded.endsWith('_VID')) {
      return decoded.slice(3, -4); // Remove "LP_" do início e "_VID" do final
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao decodificar ID:', error);
    return null;
  }
};

// Função para gerar um link compartilhável
export const generateShareableLink = (videoId: string): string => {
  const encodedId = encodeVideoId(videoId);
  const baseUrl = window.location.hostname === 'localhost' || window.location.hostname.includes('lovable.app') 
    ? window.location.origin 
    : 'https://linkproibido.com';
  return `${baseUrl}/v/${encodedId}`;
};

// Função para validar formato de ID
export const isValidVideoId = (id: string): boolean => {
  // Verifica se é um UUID válido
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};