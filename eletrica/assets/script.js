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
