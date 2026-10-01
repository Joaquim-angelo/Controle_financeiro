const formulario = document.getElementById("formulario");

const listaLancamentos =
    document.getElementById("lista-lancamentos");

const saldo =
    document.getElementById("saldo");

const ganhos =
    document.getElementById("ganhos");

const despesas =
    document.getElementById("despesas");

const reservado =
    document.getElementById("reservado");

const disponivel =
    document.getElementById("disponivel");

const formularioReserva =
    document.getElementById("formulario-reserva");

const listaReservas =
    document.getElementById("lista-reservas");


let lancamentos = [];

const dadosSalvos =
    localStorage.getItem("lancamentos");

if (dadosSalvos) {
    lancamentos = JSON.parse(dadosSalvos);
}

let reservas = [];

const reservasSalvas =
    localStorage.getItem("reservas");

if (reservasSalvas) {
    reservas = JSON.parse(reservasSalvas);
}

formulario.addEventListener("submit", function (event) {

    event.preventDefault();
    const descricao =
        document.getElementById("descricao").value;

    const valor =
        Number(document.getElementById("valor").value);

    const tipo =
        document.getElementById("tipo").value;

    const categoria =
        document.getElementById("categoria").value;

    const data =
        document.getElementById("data").value;


    const lancamento = {
        descricao: descricao,
        valor: valor,
        tipo: tipo,
        categoria: categoria,
        data: data
    };

    lancamentos.push(lancamento);
    salvarLancamentos();
    atualizarTela();
    formulario.reset();
});

formularioReserva.addEventListener(
    "submit",
    function (event) {
        event.preventDefault();
        const nome =
            document.getElementById("nome-reserva").value;

        const meta =
            Number(
                document.getElementById("meta-reserva").value
            );

        const reserva = {
            nome: nome,
            meta: meta,
            guardado: 0
        };

        reservas.push(reserva);
        salvarReservas();
        atualizarTela();
        formularioReserva.reset();
    }
);

function atualizarTela() {
    atualizarLancamentos();
    atualizarReservas();
}

function atualizarLancamentos() {
    listaLancamentos.innerHTML = "";
    let totalGanhos = 0;
    let totalDespesas = 0;

    lancamentos.forEach(
        function (lancamento, indice) {
            if (lancamento.tipo === "ganho") {
                totalGanhos += lancamento.valor;
            }

            if (lancamento.tipo === "despesa") {
                totalDespesas += lancamento.valor;
            }
            const item =
                document.createElement("div");
            item.innerHTML = `

                <strong>
                    ${lancamento.descricao}
                </strong>

                <p>
                    ${formatarMoeda(lancamento.valor)}
                </p>

                <p>
                    Tipo: ${lancamento.tipo}
                </p>

                <p>
                    Categoria: ${lancamento.categoria}
                </p>

                <p>
                    Data: ${lancamento.data}
                </p>

                <button
                    onclick="excluirLancamento(${indice})"
                >
                    Excluir
                </button>
                <hr>
            `;
            listaLancamentos.appendChild(item);
        }
    );

    const totalSaldo =
        totalGanhos - totalDespesas;

    const totalReservado =
        calcularTotalReservado();

    const totalDisponivel =
        totalSaldo - totalReservado;

    ganhos.textContent =
        formatarMoeda(totalGanhos);

    despesas.textContent =
        formatarMoeda(totalDespesas);

    saldo.textContent =
        formatarMoeda(totalSaldo);

    reservado.textContent =
        formatarMoeda(totalReservado);

    disponivel.textContent =
        formatarMoeda(totalDisponivel);
}

function atualizarReservas() {

    listaReservas.innerHTML = "";

    if (reservas.length === 0) {
        listaReservas.innerHTML =
            "<p>Nenhuma reserva cadastrada.</p>";
        return;
    }

    reservas.forEach(
        function (reserva, indice) {

            const falta =
                Math.max(
                    reserva.meta - reserva.guardado,
                    0
                );

            const percentual =
                Math.min(
                    (reserva.guardado / reserva.meta) * 100,
                    100
                );

            const item =
                document.createElement("div");

            item.innerHTML = `
                <h3>
                    ${reserva.nome}
                </h3>

                <p>
                    Meta:
                    ${formatarMoeda(reserva.meta)}
                </p>

                <p>
                    Guardado:
                    ${formatarMoeda(reserva.guardado)}
                </p>

                <p>
                    Falta:
                    ${formatarMoeda(falta)}
                </p>

                <p>
                    Progresso:
                    ${percentual.toFixed(1)}%
                </p>

                <button
                    onclick="adicionarReserva(${indice})"
                >
                    Adicionar dinheiro
                </button>

                <button
                    onclick="excluirReserva(${indice})"
                >
                    Excluir reserva
                </button>

                <hr>
            `;

            listaReservas.appendChild(item);
        }
    );
}

function adicionarReserva(indice) {
    const valor =
        Number(
            prompt("Quanto deseja reservar?")
        );
    if (!valor || valor <= 0) {
        return;
    }

    const reserva =
        reservas[indice];
    const restante =
        reserva.meta - reserva.guardado;
    if (valor > restante) {
        reserva.guardado =
            reserva.meta;
    } else {
        reserva.guardado += valor;
    }

    salvarReservas();
    atualizarTela();
}

function excluirReserva(indice) {
    reservas.splice(indice, 1);
    salvarReservas();
    atualizarTela();
}

function excluirLancamento(indice) {
    lancamentos.splice(indice, 1);
    salvarLancamentos();
    atualizarTela();
}

function salvarLancamentos() {
    localStorage.setItem(
        "lancamentos",
        JSON.stringify(lancamentos)
    );
}

function salvarReservas() {
    localStorage.setItem(
        "reservas",
        JSON.stringify(reservas)
    );
}

function calcularTotalReservado() {
    let total = 0;
    reservas.forEach(
        function (reserva) {
            total += reserva.guardado;
        }
    );
    return total;
}

function formatarMoeda(valor) {
    return valor.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}

atualizarTela();