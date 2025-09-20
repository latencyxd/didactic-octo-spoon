document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsSection = document.querySelector('.results-section');

    calculateBtn.addEventListener('click', () => {
        // Remove o blur e permite a interação com a seção de resultados
        resultsSection.classList.remove('blurred');
        
        // Chama a função principal de cálculo
        calcularLinha();
    });
});

function calcularLinha() {
    // Pegar os valores de entrada
    const R_input = document.getElementById('R').value;
    const L_input = document.getElementById('L').value;
    const C_input = document.getElementById('C').value;
    const length_input = document.getElementById('length').value;
    const V_nominal_input = document.getElementById('V_nominal').value;
    const fp_carga_input = document.getElementById('fp_carga').value;
    
    // Validar se todos os campos estão preenchidos
    if (!R_input || !L_input || !C_input || !length_input || !V_nominal_input || !fp_carga_input) {
        alert("Por favor, preencha todos os campos para realizar o cálculo.");
        return;
    }

    // Convertendo os valores de entrada para números e unidades corretas
    const R = parseFloat(R_input); // Ω/km
    const L = parseFloat(L_input) * 1e-3; // mH -> H
    const C = parseFloat(C_input) * 1e-6; // μF -> F
    const length = parseFloat(length_input); // km
    const V_nominal_kv = parseFloat(V_nominal_input); // kV
    const fp_carga = parseFloat(fp_carga_input);
    const P_carga_MW = 200; // Exemplo fixo de potência de carga
    const V_receptor_kv = 1.0; // Exemplo de tensão no receptor em pu

    // Constantes e cálculos básicos
    const f = 60; // Hz
    const omega = 2 * Math.PI * f;
    const V_nominal_V = V_nominal_kv * 1000;
    const V_receptor_V = V_receptor_kv * V_nominal_V;
    const V_receptor_phase_V = V_receptor_V / Math.sqrt(3);

    // Impedância e admitância por unidade de comprimento
    const Z_linha = math.complex(R, omega * L); // [Ω/km]
    const Y_linha = math.complex(0, omega * C); // [S/km]

    // Impedância característica (Z₀)
    const Z0 = math.sqrt(math.divide(Z_linha, Y_linha)); // [Ω]

    // Constante de propagação (γ)
    const gamma = math.sqrt(math.multiply(Z_linha, Y_linha)); // [1/km]
    const gamma_L = math.multiply(gamma, length);

    // Velocidade de propagação e comprimento de onda
    const v_prop = 1 / math.sqrt(math.multiply(L, C)); // m/s
    const comprimento_onda = v_prop / f; // m

    // Potência natural (SIL - Surge Impedance Loading)
    const P_natural = math.divide(math.pow(V_nominal_V, 2), math.abs(Z0)) / 1e6; // MW

    // Parâmetros do quadripolo
    const A = math.cosh(gamma_L);
    const B = math.multiply(Z0, math.sinh(gamma_L));
    const C = math.divide(math.sinh(gamma_L), Z0);
    const D = A; // Linha simétrica

    // Exemplo de cálculo de desempenho (precisa de valores de corrente/potência)
    const phi_carga = math.acos(fp_carga);
    const P_load_W = P_carga_MW * 1e6;
    const Q_load_VAr = P_load_W * Math.tan(phi_carga);
    const S_load = math.complex(P_load_W, Q_load_VAr);
    
    // Corrente do receptor
    const I_r = math.conj(math.divide(S_load, math.multiply(3, V_receptor_phase_V)));
    
    // Tensão e corrente do transmissor
    const V_s = math.add(math.multiply(A, V_receptor_phase_V), math.multiply(B, I_r));
    const I_s = math.add(math.multiply(C, V_receptor_phase_V), math.multiply(D, I_r));
    
    // Potência do transmissor
    const S_s = math.multiply(3, V_s, math.conj(I_s));
    const P_s = S_s.re / 1e6; // MW
    const Q_s = S_s.im / 1e6; // MVAr

    // Perdas
    const P_perdas = (S_s.re - S_load.re) / 1e6;
    const Q_perdas = (S_s.im - S_load.im) / 1e6;
    
    // Rendimento
    const rendimento = (S_load.re / S_s.re) * 100;

    // Renderizar os resultados na página
    displayResults({ R, L, C, length, V_nominal_kv, fp_carga, f, omega,
                     Z_linha, Y_linha, Z0, gamma, v_prop, comprimento_onda, P_natural,
                     A, B, C, D, P_carga_MW, P_s, Q_s, P_perdas, Q_perdas, rendimento,
                     gamma_L, V_s, I_s, I_r });
}

function displayResults(data) {
    const basicParamsDiv = document.getElementById('basic-params');
    const quadripoleParamsDiv = document.getElementById('quadripole-params');
    const performanceAnalysisDiv = document.getElementById('performance-analysis');
    const technicalNotesDiv = document.getElementById('technical-notes');
    
    // Limpa os conteúdos anteriores
    basicParamsDiv.innerHTML = '';
    quadripoleParamsDiv.innerHTML = '';
    performanceAnalysisDiv.innerHTML = '';
    technicalNotesDiv.innerHTML = '';

    // Parâmetros da Linha
    basicParamsDiv.innerHTML = `
        <p><strong>Frequência:</strong> ${data.f} Hz</p>
        <p><strong>Comprimento da linha:</strong> ${data.length} km</p>
        <p><strong>Tensão nominal:</strong> ${data.V_nominal_kv} kV</p>
        <p><strong>Impedância Característica (Z₀):</strong> ${math.abs(data.Z0).toFixed(3)} Ω ∠ ${math.degrees(math.phase(data.Z0)).toFixed(3)}°</p>
        <p><strong>Constante de Propagação (γ):</strong> ${(math.abs(data.gamma) * 1000).toFixed(6)} × 10⁻³ /km ∠ ${math.degrees(math.phase(data.gamma)).toFixed(3)}°</p>
        <p><strong>Velocidade de Propagação:</strong> ${(data.v_prop / 1000).toFixed(1)} km/s</p>
        <p><strong>Potência Natural (SIL):</strong> ${data.P_natural.toFixed(1)} MW</p>
    `;

    // Parâmetros do Quadripolo
    quadripoleParamsDiv.innerHTML = `
        <p><strong>A:</strong> ${data.A.re.toFixed(8)} + j${data.A.im.toFixed(8)}</p>
        <p><strong>B:</strong> ${data.B.re.toFixed(3)} + j${data.B.im.toFixed(3)} Ω</p>
        <p><strong>C:</strong> ${(data.C.re * 1e6).toFixed(6)} + j${(data.C.im * 1e6).toFixed(6)} μS</p>
        <p><strong>D:</strong> ${data.D.re.toFixed(8)} + j${data.D.im.toFixed(8)}</p>
    `;

    // Análise de Desempenho
    performanceAnalysisDiv.innerHTML = `
        <p><strong>Potência Ativa Transmitida:</strong> ${data.P_s.toFixed(1)} MW</p>
        <p><strong>Potência Reativa Transmitida:</strong> ${data.Q_s.toFixed(1)} MVAr</p>
        <p><strong>Perdas Ativas:</strong> ${data.P_perdas.toFixed(1)} MW</p>
        <p><strong>Perdas Reativas:</strong> ${data.Q_perdas.toFixed(1)} MVAr</p>
        <p><strong>Rendimento:</strong> ${data.rendimento.toFixed(2)}%</p>
    `;
    
    // Observações Técnicas
    let observacoes = `
    • Linha classificada como: ${data.length > 240 ? 'LONGA' : data.length > 80 ? 'MÉDIA' : 'CURTA'}
    • Comprimento elétrico: ${math.abs(data.gamma_L).toFixed(3)} rad (${math.degrees(math.abs(data.gamma_L)).toFixed(1)}°)
    • Carregamento natural: ${((data.P_carga_MW / data.P_natural) * 100).toFixed(1)}% do SIL
    `;

    technicalNotesDiv.innerHTML = `
        <pre>${observacoes}</pre>
    `;
}