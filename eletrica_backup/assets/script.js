function calcularCap1() {
    const v1 = parseFloat(document.getElementById('valor1').value);
    const v2 = parseFloat(document.getElementById('valor2').value);
    if (isNaN(v1) || isNaN(v2)) {
        alert("Preencha os dois valores!");
        return;
    }
    const resultado = v1 + v2; // exemplo simples, depois troca pela fórmula real
    document.getElementById('resultado').textContent = resultado;
}
function calcular() {
  const R = parseFloat(document.getElementById('R').value);
  const L = parseFloat(document.getElementById('L').value);
  const G = parseFloat(document.getElementById('G').value);
  const C = parseFloat(document.getElementById('C').value);
  const f = parseFloat(document.getElementById('f').value);

  const w = 2 * Math.PI * f;

  // Constante de propagação γ = sqrt((R + jωL)(G + jωC))
  const gamma = math.sqrt(math.complex(R, w*L).mul(math.complex(G, w*C)));

  // Impedância característica Z0 = sqrt((R + jωL)/(G + jωC))
  const Z0 = math.sqrt(math.complex(R, w*L).div(math.complex(G, w*C)));

  document.getElementById('resultado').innerHTML = `
    <p><strong>Constante de propagação (γ):</strong> ${gamma.toString()}</p>
    <p><strong>Impedância característica (Z₀):</strong> ${Z0.toString()}</p>
  `;
}