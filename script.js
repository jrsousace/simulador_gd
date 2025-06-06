console.log("Script carregado.");

// Inicialização do IndexedDB
let db;
let dbReady = false;

function initDB() {
    const request = indexedDB.open("SimuladorTinoDB", 1);
    request.onerror = function (event) {
        console.error("Erro ao abrir o banco IndexedDB:", event);
    };
    request.onsuccess = function (event) {
        db = event.target.result;
        dbReady = true;  // ✅ MARCA QUE ESTÁ PRONTO
        console.log("Banco de dados aberto com sucesso.");
    };
    request.onupgradeneeded = function (event) {
        db = event.target.result;
        const objectStore = db.createObjectStore("clientes", { keyPath: "id", autoIncrement: true });
        console.log("ObjectStore 'clientes' criado.");
    };
}

initDB();

// Função para listar todas as simulações
function listarSimulacoes(callback) {
    if (!dbReady) {
        console.error("Banco de dados não está pronto.");
        return;
    }
    const transaction = db.transaction(["clientes"], "readonly");
    const store = transaction.objectStore("clientes");
    const request = store.getAll();
    request.onsuccess = function (event) {
        callback(event.target.result);
    };
    request.onerror = function (event) {
        console.error("Erro ao listar as simulações:", event);
    };
}

// Exportar simulações como JSON
function exportarSimulacoesParaJSON() {
    listarSimulacoes(function (dados) {
        const json = JSON.stringify(dados, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "simulacoes_tino.json";
        a.click();
        URL.revokeObjectURL(url);
        alert('Arquivo JSON exportado com sucesso!');
    });
}

// Listener do formulário
document.getElementById("simulador-form").addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("Formulário enviado.");
  const nomeCliente = document.getElementById("cliente")?.value || "Cliente";
    const classeRadios = document.querySelectorAll('input[name="classe_instalacao"]');
    let classeSelecionada;
        for (const radio of classeRadios) {
            if (radio.checked) {
            classeSelecionada = radio.value;
        break;
            }
        }
  const classe = classeSelecionada;
  const consumo = parseFloat(document.getElementById("consumo").value);
  const te = parseFloat(document.getElementById("te").value);
  const tusd = parseFloat(document.getElementById("tusd").value);
  const bandeiraAmarela = parseFloat(document.getElementById("bandeira_amarela").value);
  const bandeiraVermelha = parseFloat(document.getElementById("bandeira_vermelha").value);
  const desconto = parseFloat(document.getElementById("desconto_percentual").value);

  const valoresFixos = {
    iluminacao: parseFloat(document.getElementById("iluminacao").value || 0),
    multa: parseFloat(document.getElementById("multa").value || 0),
    juros: parseFloat(document.getElementById("juros").value || 0),
    correcao: parseFloat(document.getElementById("correcao").value || 0),
    doacoes: parseFloat(document.getElementById("doacoes").value || 0),
    encargos: parseFloat(document.getElementById("encargos").value || 0),
    dmic: parseFloat(document.getElementById("dmic").value || 0),
    descontos: parseFloat(document.getElementById("descontos").value || 0)
  };

  if (!classe || isNaN(consumo) || isNaN(te) || isNaN(tusd) || isNaN(bandeiraAmarela) || isNaN(bandeiraVermelha) || isNaN(desconto)) {
    alert("Por favor, preencha todos os campos obrigatórios corretamente.");
    return;
  }

  // Taxa de disponibilidade por classe
  let taxaDisponibilidadeKwh = 0;
  if (classe === "Monofásica") taxaDisponibilidadeKwh = 30;
  else if (classe === "Bifásica") taxaDisponibilidadeKwh = 50;
  else if (classe === "Trifásica") taxaDisponibilidadeKwh = 100;

  // Cálculos principais
  const valorConcessionaria = te + tusd + bandeiraAmarela + bandeiraVermelha;
  const valorSemDesconto = valorConcessionaria * consumo
  const valorTino = valorConcessionaria * (1 - desconto / 100);
  const economiaTino = valorConcessionaria - valorTino;

  const consumoCompensavel = Math.max(0, consumo - taxaDisponibilidadeKwh);
  const consumoTino = consumoCompensavel * valorTino;
  const descontoFaturaMes = consumoCompensavel*(valorConcessionaria-valorTino);
  const descontoAnual = descontoFaturaMes * 12;

  const valorTaxaDisponibilidade = taxaDisponibilidadeKwh * valorConcessionaria;

  const valorFixoConcessionaria =
    valoresFixos.iluminacao +
    valoresFixos.doacoes +
    valoresFixos.encargos;

const valorFixoFinal=valorFixoConcessionaria + 
valorTaxaDisponibilidade;

  // Exibição
  const resultado = document.getElementById("resultado");
  resultado.innerHTML = `
      <p><strong>Sua simulação está pronta, ${nomeCliente}!</strong></p>
      <p>Atualmente, a concessionária cobra <strong>R$ ${valorConcessionaria.toFixed(2)}/kWh</strong>. Você paga <strong>R$ ${valorSemDesconto.toFixed(2)}/kWh</strong> pelo seu consumo nessa fatura.</p>
      <p>Com a Tino Energia, o preço passa a ser <strong>R$ ${valorTino.toFixed(2)}/kWh</strong>! Economize com a gente, pagando apenas <strong>R$ ${consumoTino.toFixed(2)}!</strong></p>
      <p>Confira sua economia abaixo:</p>

      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Valor (R$)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Energia compensada</td><td>${consumoCompensavel.toFixed(2)} kWh</td></tr>
          <tr><td><strong>Consumo pela Tino</strong></td><td><strong>R$ ${consumoTino.toFixed(2)}</strong></td></tr>
          <tr><td>Economia mensal</td><td>R$ ${descontoFaturaMes.toFixed(2)}</td></tr>
          <tr><td>Economia anual estimada</td><td>R$ ${descontoAnual.toFixed(2)}</td></tr>
        </tbody>
      </table>

      <p>⚠️ ATENÇÃO! Sua concessionária continuará cobrando valores fixos (iluminação pública, multas, encargos, juros, doações, etc).</p>
      <p><strong>Taxa de disponibilidade da concessionária conforme legislação:</strong> ${taxaDisponibilidadeKwh} kWh → R$ ${valorTaxaDisponibilidade.toFixed(2)}</p>
      <p><strong>Valores fixos estimados a serem pagos à concessionária:</strong> R$ ${valorFixoConcessionaria.toFixed(2)}</p>
      <p><strong>Total remanescente a ser pago à concessionária:</strong> R$ (${valorFixoConcessionaria.toFixed(2)}+${valorTaxaDisponibilidade.toFixed(2)}) = ${valorFixoFinal.toFixed(2)}</p>
      <button id="nova-simulacao">Nova Simulação</button>
  `
  document.getElementById("nova-simulacao").addEventListener("click", function() {
    document.getElementById("simulador-form").reset();  // ✅ limpa todos os campos!
    document.getElementById("simulador-form").style.display = "block";
    document.getElementById("resultado").style.display = "none";
    this.remove();  // ou this.style.display = "none";
});
  document.getElementById("resultado").style.display = "block";
  document.getElementById("simulador-form").style.display = "none";

  const dadosSimulacao = {
  nomeCliente: document.getElementById("cliente").value,
  cpfCnpj: document.getElementById("cpf_cnpj").value,
  codigoInstalacao: document.getElementById("codigo_instalacao").value,
  codigoCliente: document.getElementById("codigo_cliente").value,
  classe: classe,
  consumo: consumo,
  data: new Date().toISOString()
    };
    
    if (!dbReady) {
    alert("Banco de dados ainda não está pronto. Tente novamente em alguns segundos.");
    return;
    }
    salvarSimulacao(dadosSimulacao);
});

// Exportar simulações como CSV
function exportarSimulacoesParaCSV() {
    listarSimulacoes(function (dados) {
        if (dados.length === 0) {
            alert("Nenhuma simulação para exportar.");
            return;
        }

        const cabecalho = ["Nome", "CPF ou CNPJ", "Código Instalação", "Código Cliente", "Classe", "Consumo (kWh)"];
        const linhas = dados.map(dado => [
            dado.nomeCliente || "",
            dado.cpfCnpj || "",
            dado.codigoInstalacao || "",
            dado.codigoCliente || "",
            dado.classe || "",
            dado.consumo || ""
        ]);

        let csvContent = cabecalho.join(";") + "\n";
        linhas.forEach(linha => {
            csvContent += linha.join(";") + "\n";
        });

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "simulacoes_tino.csv";
        a.click();

        URL.revokeObjectURL(url);
        alert('Arquivo CSV exportado com sucesso!');
    });
}

// Função para salvar simulações
function salvarSimulacao(dados) {
    if (!dbReady) {
        console.error("Banco de dados não está pronto.");
        return;
    }
    const transaction = db.transaction(["clientes"], "readwrite");
    const store = transaction.objectStore("clientes");
    const request = store.add(dados);
    request.onsuccess = function () {
        console.log("Simulação salva com sucesso no IndexedDB.");
    };
    request.onerror = function (event) {
        console.error("Erro ao salvar a simulação:", event);
    };
}

function verHistoricoSimulacoes() {
    if (!dbReady) {
        alert("Banco de dados ainda não está pronto. Tente novamente em alguns segundos.");
        return;
    }

    listarSimulacoes(function (dados) {
        const historicoDiv = document.getElementById("historico");
        historicoDiv.innerHTML = "";

        if (dados.length === 0) {
            historicoDiv.innerHTML = "<p>Nenhuma simulação registrada.</p>";
        } else {
            const lista = document.createElement("ul");
            lista.style.listStyleType = "none";
            lista.style.padding = "0";

            dados.forEach(sim => {
                const item = document.createElement("li");
                item.style.border = "1px solid #ccc";
                item.style.margin = "8px 0";
                item.style.padding = "8px";
                item.style.borderRadius = "4px";

                item.innerHTML = `
                    <strong>Nome:</strong> ${sim.nomeCliente} <br>
                    <strong>CPF/CNPJ:</strong> ${sim.cpfCnpj} <br>
                    <strong>Código Instalação:</strong> ${sim.codigoInstalacao} <br>
                    <strong>Código Cliente:</strong> ${sim.codigoCliente} <br>
                    <strong>Classe:</strong> ${sim.classe} <br>
                    <strong>Consumo:</strong> ${sim.consumo} kWh <br>
                    <strong>Data:</strong> ${new Date(sim.data).toLocaleString()}
                `;
                lista.appendChild(item);
            });

            historicoDiv.appendChild(lista);
        }

        // ✅ Toggle display
        if (historicoDiv.style.display === "none" || historicoDiv.style.display === "") {
            historicoDiv.style.display = "block";
        } else {
            historicoDiv.style.display = "none";
        }
    });
}

document.getElementById("exportar-json").addEventListener("click", exportarSimulacoesParaJSON);
document.getElementById("exportar-csv").addEventListener("click", exportarSimulacoesParaCSV);
document.getElementById("ver-historico").addEventListener("click", verHistoricoSimulacoes);