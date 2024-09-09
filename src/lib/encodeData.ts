export const encodeData = (data: any) => {
  try {
    const sData = JSON.stringify(data);
    const encodedData = new TextEncoder().encode(sData);
    return btoa(String.fromCharCode(...encodedData));
  } catch (error) {
    throw new Error('Failed to encode data');
  }
};
