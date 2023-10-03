generateCustomerCode = () => {
  // Genera un número aleatorio entre 0 y 999999999999 (12 dígitos)
  const randomNum = Math.floor(Math.random() * 1_000_000_000_000);
  
  // Convierte el número a una cadena y rellena con ceros a la izquierda si es necesario
  const customerCode = String(randomNum).padStart(12, '0');
  
  return customerCode;
}


module.exports = { generateCustomerCode };

