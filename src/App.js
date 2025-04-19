import React, { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell, // ⬅️ este é o item que estava faltando!
} from "recharts";

// ✅ Função para formatar moeda
const formatarMoeda = (valor) => {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

// ✅ Função de cálculo, fora do App()
const calcularFinanciamento = (preco, entrada, parcelas, taxa = 0.023) => {
  const saldoFinanciado = preco - entrada;

  if (parcelas === 0) {
    return {
      valorParcela: 0,
      saldoComJuros: 0,
      valorTotalFinanciado: preco,
      valorRealVenda: preco,
      indiceEfetivo: 1,
    };
  }

  const valorParcela =
    saldoFinanciado * (taxa / (1 - Math.pow(1 + taxa, -parcelas)));
  const saldoComJuros = valorParcela * parcelas;
  const valorTotalFinanciado = entrada + saldoComJuros;
  const valorPresenteParcelas = saldoComJuros / Math.pow(1 + taxa, parcelas);
  const valorRealVenda = entrada + valorPresenteParcelas;
  const indiceEfetivo = valorRealVenda / preco;

  return {
    valorParcela,
    saldoComJuros,
    valorTotalFinanciado,
    valorRealVenda,
    indiceEfetivo,
  };
};

const produtos = {
  "102KIT": {
    descricao: "ADAPTADOR 102 JETTA",
    precoOriginal: 492.95,
    robOriginal: 0.473871,
  },
  "103KIT": {
    descricao: "ADAPTADOR 103 GOLF TURBO",
    precoOriginal: 306.44,
    robOriginal: 0.580325,
  },
  "104KIT": {
    descricao: "ADAPTADOR 104 AL4/JATCO ",
    precoOriginal: 619.5,
    robOriginal: 0.465915,
  },
  "106KIT": {
    descricao: "ADAPTADOR 106 CAPTIVA",
    precoOriginal: 243.94,
    robOriginal: 0.475076,
  },
  "107KIT": {
    descricao: "ADAPTADOR 107 FOCUS",
    precoOriginal: 157.05,
    robOriginal: 0.569875,
  },
  "108KIT": {
    descricao: "ADAPTADOR 108 LAND ROVER VOGUE/BMW",
    precoOriginal: 816.35,
    robOriginal: 0.475057,
  },
  "109KIT": {
    descricao: "ADAPTADOR 109 NISSAN",
    precoOriginal: 910.84,
    robOriginal: 0.705377,
  },
  "110KIT": {
    descricao: "ADAPTADOR 110 HONDA ACCORD",
    precoOriginal: 394.52,
    robOriginal: 0.484345,
  },
  "111KIT": {
    descricao: "ADAPTADOR 111 VW PASSAT",
    precoOriginal: 228.53,
    robOriginal: 0.580195,
  },
  "112KIT": {
    descricao: "ADAPTADOR 112 GM COBALT/SPIN/CRUZE",
    precoOriginal: 57.59,
    robOriginal: 0.555107,
  },
  "113KIT": {
    descricao: "ADAPTADOR 113 TOUAREG/CAYENNE/4HP18/AMAROK A PARTIR 2013",
    precoOriginal: 739.27,
    robOriginal: 0.563457,
  },
  "114KIT": {
    descricao: "ADAPTADOR 114 RANGER 3.2 ",
    precoOriginal: 561.47,
    robOriginal: 0.47478,
  },
  "115KIT": {
    descricao: "ADAPTADOR 115 CHRYSLER 300",
    precoOriginal: 57.59,
    robOriginal: 0.571241,
  },
  "116KIT": {
    descricao: "ADAPTADOR 116 BORA 2007 MOD ARGENTINO",
    precoOriginal: 204.75,
    robOriginal: 0.583647,
  },
  "117KIT": {
    descricao: "ADAPTADOR 117 MERCEDES BENZ SLK",
    precoOriginal: 57.59,
    robOriginal: 0.571241,
  },
  "118KIT": {
    descricao: "ADAPTADOR 118 GM CRUZE/ONIX/CAPTIVA SPORT ",
    precoOriginal: 501.24,
    robOriginal: 0.475073,
  },
  "119KIT": {
    descricao: "ADAPTADOR 119 AMAROK ATE 2012",
    precoOriginal: 418.95,
    robOriginal: 0.485878,
  },
  "120KIT": {
    descricao: "ADAPTADOR 120 VW DSG",
    precoOriginal: 448.32,
    robOriginal: 0.493765,
  },
  "121KIT": {
    descricao: "ADAPTADOR 121 FORD FUSION",
    precoOriginal: 579.83,
    robOriginal: 0.486454,
  },
  "122KIT": {
    descricao: "ADAPTADOR 122 COROLLA CVT/JEEP RENEGADE",
    precoOriginal: 389.74,
    robOriginal: 0.488878,
  },
  "123KIT": {
    descricao: "ADAPTADOR 123 VOLVO XC 60",
    precoOriginal: 128.54,
    robOriginal: 0.49112,
  },
  "124KIT": {
    descricao: "ADAPTADOR 124 AUDI Q3 A PARTIR DE 2013",
    precoOriginal: 472.23,
    robOriginal: 0.483795,
  },
  "125KIT": {
    descricao: "ADAPTADOR 125 VW TIGUAN",
    precoOriginal: 558.07,
    robOriginal: 0.475132,
  },
  "126KIT": {
    descricao: "ADAPTADOR 126 PEUGEOT 408/TF 72SC",
    precoOriginal: 374.82,
    robOriginal: 0.474764,
  },
  "127KIT": {
    descricao: "ADAPTADOR 127 ZF5HP19 BMW320i/AUDI A4/...",
    precoOriginal: 237.0,
    robOriginal: 0.475959,
  },
  "128KIT": {
    descricao: "ADAPTADOR 128 HONDA FIT CVT",
    precoOriginal: 449.52,
    robOriginal: 0.479193,
  },
  "129KIT": {
    descricao: "ADAPTADOR 129 ZF 9HP48/JEEP RENEGADE DIESEL",
    precoOriginal: 481.58,
    robOriginal: 0.474503,
  },
  "130KIT": {
    descricao: "ADAPTADOR 130 C4 LOUNGE/THP AISIN",
    precoOriginal: 417.24,
    robOriginal: 0.512249,
  },
  "131KIT": {
    descricao: "ADAPTADOR 131 VERSA 1.6 CVT",
    precoOriginal: 448.32,
    robOriginal: 0.478221,
  },
  "132KIT": {
    descricao: "ADAPTADOR 132 BMW X1",
    precoOriginal: 208.08,
    robOriginal: 0.60422,
  },
  "133KIT": {
    descricao: "ADAPTADOR 133 DSG GOLF TSFI",
    precoOriginal: 519.75,
    robOriginal: 0.533001,
  },
  "134KIT": {
    descricao:
      "ADAPTADOR 134 (KIT) PAR MANGUEIRAS P/ ADAPTADORES DE PLACAS IMPORTADOS",
    precoOriginal: 147.0,
    robOriginal: 0.575665,
  },
  "135KIT         ": {
    descricao: "ADAPTADOR 135 09G – VW VIRTUS / NOVO POLO",
    precoOriginal: 426.8,
    robOriginal: 0.476132,
  },
  "136KIT         ": {
    descricao: "ADAPTADOR 136 ZF 9HP48 - FIAT TORO FLEX     ",
    precoOriginal: 87.03,
    robOriginal: 0.652673,
  },
  "137KIT         ": {
    descricao: "ADAPTADOR 137 M BENZ 7GDCT AUTOMATIZADA",
    precoOriginal: 669.56,
    robOriginal: 0.600653,
  },
  "138KIT": {
    descricao: "ADAPTADOR 138 (KIT) - ENGATE RAPIDO - 2 PEÇAS",
    precoOriginal: 328.77,
    robOriginal: 0.610167,
  },
  "139KIT": {
    descricao: "ADAPTADOR 139 VOLVO XC-60 T5 DSG",
    precoOriginal: 469.84,
    robOriginal: 0.485064,
  },
  "140KIT": {
    descricao: "ADAPTADOR 140 HONDA TURBO 1.5 CVT",
    precoOriginal: 466.26,
    robOriginal: 0.492271,
  },
  "141KIT": {
    descricao: "ADAPTADOR 141 GM TRAIL BLAZER 2021/CAMARO",
    precoOriginal: 587.01,
    robOriginal: 0.514224,
  },
  "142KIT": {
    descricao: "ADAPTADOR 142 KIT VW PASSAT TSI 2009",
    precoOriginal: 540.16,
    robOriginal: 0.540325,
  },
  "143KIT": {
    descricao: "ADAPTADOR 143 MERCEDES BENZ CLASSE C, E, ML, S",
    precoOriginal: 652.76,
    robOriginal: 0.639452,
  },
  "144KIT": {
    descricao: "ADAPTADOR 144 BMW X6",
    precoOriginal: 388.55,
    robOriginal: 0.630341,
  },
  "145KIT": {
    descricao: "ADAPTADOR 145 BMW 523i",
    precoOriginal: 705.36,
    robOriginal: 0.629444,
  },
  "146KIT": {
    descricao: "ADAPTADOR 146 MERCEDES BENZ 722.9",
    precoOriginal: 657.54,
    robOriginal: 0.649203,
  },
  "147KIT": {
    descricao: "ADAPTADOR 147 KIT ANGULAR PARA ESPIGÃO 8MM ",
    precoOriginal: 390.24,
    robOriginal: 0.474444,
  },
  "148KIT": {
    descricao: "ADAPTADOR 148 VW POLO TSI 1.0 ",
    precoOriginal: 692.21,
    robOriginal: 0.54484,
  },
  "149KIT": {
    descricao: "ADAPTADOR 149 TOYOTA COROLLA CVT 10 MARCHAS",
    precoOriginal: 523.04,
    robOriginal: 0.565933,
  },
  "150KIT": {
    descricao: "ADAPTADOR 150 FORD BRONCO, MAVERICK, TERRITORY...",
    precoOriginal: 437.56,
    robOriginal: 0.739981,
  },
  "L00109     ": {
    descricao: "ADAPTADOR CAN FD GM PARA X-431 PRO GT/PRO1SV4.0",
    precoOriginal: 1214.47,
    robOriginal: 0.457167,
  },
  L00105: {
    descricao: "ADAPTADOR CHRYSLER/FIAT SGW 12+8 PARA PRO GT",
    precoOriginal: 438.23,
    robOriginal: 0.548299,
  },
  L00336: {
    descricao: "ADAPTADOR DoiP PARA PARA DBS CAR ACIMA DE VII",
    precoOriginal: 825.3,
    robOriginal: 0.552934,
  },
  L00321: {
    descricao: "ADAPTADOR PARA TRANSFORMAR VALUE DE: 134A PARA: 1234YF",
    precoOriginal: 892.5,
    robOriginal: 0.512036,
  },
  FT22001: {
    descricao: "ALINHADORA 3D FORTA TECH ALIGN ADVANCED",
    precoOriginal: 79800.0,
    robOriginal: 0.44481,
  },
  FT24001: {
    descricao:
      "ALINHADORA 3D PARA ELEVADORES 2 COLUNAS FORTA TECH ALIGN FUSION",
    precoOriginal: 48160.32,
    robOriginal: 0.482848,
  },
  FT24002: {
    descricao: "ALINHADORA 3D PORTÁTIL FORTA TECH ALIGN TITAN",
    precoOriginal: 104160.0,
    robOriginal: 0.414141,
  },
  FT22002: {
    descricao: "ALINHADORA 3D TORRE FIXA FORTA TECH ALIGN ESSENCE ",
    precoOriginal: 44900.0,
    robOriginal: 0.436908,
  },
  SS24001: {
    descricao: "ALINHADORA WIRELESS TOUCHLESS SMARTSAFE WA913",
    precoOriginal: 112377.26,
    robOriginal: 0.451386,
  },
  "20021FTC": {
    descricao:
      "ANTENA DE COMUNICAÇÃO PARA EQUIPAMENTO GATILHO INTELIGENTE - FORTA TECH FLOW SMART 901 - FW901",
    precoOriginal: 2092.42,
    robOriginal: 0.47257,
  },
  "LIC-UPDAPIII-SR": {
    descricao: "ATUALIZAÇÃO DE SOFTWARE  X-431 PAD III / PAD V - 12 MESES",
    precoOriginal: 5232.51,
    robOriginal: 0.50439,
  },
  "LIC-UPDAPAV-SRV": {
    descricao: "ATUALIZAÇÃO DE SOFTWARE  X-431 PAD VII - 12 MESES",
    precoOriginal: 6247.5,
    robOriginal: 0.453139,
  },
  "LIC-UPDAPRO-SRV": {
    descricao:
      "ATUALIZAÇÃO DE SOFTWARE  X-431 PROSE/1S/SCANPAD/GT - 12 MESES GASOLINA",
    precoOriginal: 3581.68,
    robOriginal: 0.515833,
  },
  FT22004: {
    descricao: "BALANCEADORA DE RODAS FORTA TECH B102 VERMELHA",
    precoOriginal: 15890.0,
    robOriginal: 0.499269,
  },
  FT22006: {
    descricao: "BALANCEADORA DE RODAS FORTA TECH B104 VERMELHA",
    precoOriginal: 24900.0,
    robOriginal: 0.392548,
  },
  "25004FTC": {
    descricao:
      "BALANCEADORA DE RODAS LASER FORTA TECH SPIN 200 - SP200 - VERMELHA",
    precoOriginal: 7980.0,
    robOriginal: 0.515408,
  },
  "25005FTC": {
    descricao:
      "BALANCEADORA DE RODAS TOUCH FORTA TECH SPIN 500 - SP500 - VERMELHA",
    precoOriginal: 16950.0,
    robOriginal: 0.508835,
  },
  INN102: {
    descricao: "BASE H NACIONAL PARA ELEVADORES - MODELO FORTA TECH SEBN-402",
    precoOriginal: 5858.1,
    robOriginal: 0.339139,
  },
  "20024FTC": {
    descricao:
      "BOMBA ELETRICA MÓVEL COM TABLET E APLICATIVO, RACK, GATILHO E ACESSÓRIOS - FT-PUMP FORTA TECH FLOW ELITE X3 - FWX3",
    precoOriginal: 10900.0,
    robOriginal: 0.440286,
  },
  FT22007: {
    descricao: "CALIBRADOR DE PNEUS POR NITROGENIO 40L 2 PNEUS FORTA TECH C300",
    precoOriginal: 14606.27,
    robOriginal: 0.489858,
  },
  L00202: {
    descricao:
      "CAMERA DE INSPEÇÃO - ENDOSCOPIO COM CABO FLEXIVEL E DUAS CAMERAS SMARTSAFE",
    precoOriginal: 724.5,
    robOriginal: 0.532646,
  },
  "00042": {
    descricao:
      "CAMERA DE INSPEÇÃO - ENDOSCOPIO COM CABO FLEXIVEL LAUNCH VSP 600",
    precoOriginal: 829.5,
    robOriginal: 0.582121,
  },
  L00193: {
    descricao:
      "CAMERA DE INSPEÇÃO - ENDOSCOPIO COM CABO FLEXIVEL LAUNCH VSP 800",
    precoOriginal: 976.5,
    robOriginal: 0.540715,
  },
  L00194: {
    descricao:
      "CAMERA DE INSPEÇÃO - ENDOSCOPIO COM CABO FLEXIVEL LAUNCH VSP 808",
    precoOriginal: 1668.96,
    robOriginal: 0.482355,
  },
  L00350: {
    descricao:
      "CARREGADOR E ESTABILIZADOR DE CARGA PFP-150 P/ PROGRAMAÇÃO DE BATERIA 220v LAUNCH",
    precoOriginal: 9397.5,
    robOriginal: 0.457218,
  },
  TTH84: {
    descricao:
      "CARRINHO DE FERRAMENTAS INSULADAS PARA VHE PROFISSIONAL LAUNCH TTH84",
    precoOriginal: 24850.0,
    robOriginal: 0.412597,
  },
  TTH208: {
    descricao: "CARRINHO DE FERRAMENTAS PROFISSIONAL LAUNCH TTH208",
    precoOriginal: 11600.0,
    robOriginal: 0.44591,
  },
  TTH375: {
    descricao: "CARRINHO DE FERRAMENTAS PROFISSIONAL LAUNCH TTH375",
    precoOriginal: 17900.0,
    robOriginal: 0.446355,
  },
  RX001: {
    descricao:
      "CARTÃO PARA ANALISE CROMATOGRAFICA DE FLUIDOS - VITAL FLUIDS - PT- UNIDADE",
    precoOriginal: 31.4,
    robOriginal: 0.459653,
  },
  "L00414              ": {
    descricao:
      "CHAVE LE3-BLADE-01 (307110129)                                                            ",
    precoOriginal: 246.83,
    robOriginal: 0.602271,
  },
  "L00415              ": {
    descricao:
      "CHAVE LE3-LEXUS-01 (307110131 )                                                 ",
    precoOriginal: 246.83,
    robOriginal: 0.602271,
  },
  "L00410              ": {
    descricao:
      "CHAVE LE3-PEUGEOT-01 (307110123 )                                               ",
    precoOriginal: 246.83,
    robOriginal: 0.648161,
  },
  "L00412              ": {
    descricao:
      "CHAVE LE3-TOYOTA-01 (307110125 )                                                ",
    precoOriginal: 246.83,
    robOriginal: 0.648161,
  },
  "L00411              ": {
    descricao:
      "CHAVE LE3-VOLKSWAGEN-01  (307110124 )                                           ",
    precoOriginal: 246.83,
    robOriginal: 0.694051,
  },
  "L00413              ": {
    descricao:
      "CHAVE LE4-FORD-01 (307110126 )                                                  ",
    precoOriginal: 246.83,
    robOriginal: 0.648161,
  },
  "L00416              ": {
    descricao:
      "CHAVE LE4-LEXUS-01 (307110132 )                                                 ",
    precoOriginal: 246.83,
    robOriginal: 0.602271,
  },
  "L00424              ": {
    descricao:
      "CHAVE LK2+1-HODA-01 ( 307110140 )                                               ",
    precoOriginal: 246.83,
    robOriginal: 0.694051,
  },
  "L00423              ": {
    descricao:
      "CHAVE LK3+1-HODA-01 ( 307110139 )                                               ",
    precoOriginal: 246.83,
    robOriginal: 0.694051,
  },
  "L00420              ": {
    descricao:
      "CHAVE LK3-AUDI-01 (307110136 )                                                  ",
    precoOriginal: 246.83,
    robOriginal: 0.694051,
  },
  "L00422              ": {
    descricao:
      "CHAVE LK3-HONDA-01  (307110138 )                                                ",
    precoOriginal: 246.83,
    robOriginal: 0.694051,
  },
  "L00421              ": {
    descricao:
      "CHAVE LK3-PEUGEOT-01 (307110137 )                                               ",
    precoOriginal: 246.83,
    robOriginal: 0.694051,
  },
  "L00417              ": {
    descricao:
      "CHAVE LK3-VOLKSWAGEN-01  (307110133 )                                           ",
    precoOriginal: 246.83,
    robOriginal: 0.694051,
  },
  "L00418              ": {
    descricao:
      "CHAVE LK3-VOLKSWAGEN-02  (307110134 )                                           ",
    precoOriginal: 246.83,
    robOriginal: 0.739941,
  },
  "L00419              ": {
    descricao:
      "CHAVE LK3-VOLKSWAGEN-03  (307110135 )                                           ",
    precoOriginal: 246.83,
    robOriginal: 0.739941,
  },
  "L00402              ": {
    descricao:
      "CHAVE LN2-TOYOTA-01  (307110109 )                                               ",
    precoOriginal: 246.83,
    robOriginal: 0.648161,
  },
  "L00399              ": {
    descricao:
      "CHAVE LN3+1-HODA-01 (307110107 )                                                ",
    precoOriginal: 246.83,
    robOriginal: 0.648161,
  },
  "L00405              ": {
    descricao:
      "CHAVE LN3-AUDI-01 (307110117 )                                                  ",
    precoOriginal: 246.83,
    robOriginal: 0.648161,
  },
  "L00407              ": {
    descricao:
      "CHAVE LN3-BLADE-01 (307110119 )                                                 ",
    precoOriginal: 246.83,
    robOriginal: 0.602271,
  },
  "L00400              ": {
    descricao:
      "CHAVE LN3-HONDA-01 (307110106)                                                  ",
    precoOriginal: 246.83,
    robOriginal: 0.648161,
  },
  "L00404              ": {
    descricao:
      "CHAVE LN3-HYUNDAI-01 ( 307110112 )                                              ",
    precoOriginal: 246.83,
    robOriginal: 0.648161,
  },
  "L00408              ": {
    descricao:
      "CHAVE LN3-LEXUS-01 (307110121 )                                                 ",
    precoOriginal: 246.83,
    robOriginal: 0.602271,
  },
  "L00397              ": {
    descricao:
      "CHAVE LN3-PEUGEOT-01 ( 307110104 )                                             ",
    precoOriginal: 246.83,
    robOriginal: 0.648161,
  },
  "L00401              ": {
    descricao:
      "CHAVE LN3-TOYOTA-01 (307110108 )                                                ",
    precoOriginal: 246.83,
    robOriginal: 0.648161,
  },
  "L00406              ": {
    descricao:
      "CHAVE LN4-AUDI-01 (307110118 )                                                  ",
    precoOriginal: 246.83,
    robOriginal: 0.648161,
  },
  "L00403              ": {
    descricao:
      "CHAVE LN4-HYUNDAI-01 ( 307110111 )                                              ",
    precoOriginal: 246.83,
    robOriginal: 0.648161,
  },
  "L00409              ": {
    descricao:
      "CHAVE LN4-LEXUS-01 (307110122 )                                                 ",
    precoOriginal: 246.83,
    robOriginal: 0.602271,
  },
  "L00398              ": {
    descricao:
      "CHAVE LN-FORD-01 (307110105 )                                                   ",
    precoOriginal: 246.83,
    robOriginal: 0.648161,
  },
  "L00394              ": {
    descricao:
      "CHAVE LS4-AUDI-01 ( 307110099 )                                                 ",
    precoOriginal: 408.73,
    robOriginal: 0.535522,
  },
  "L00395              ": {
    descricao:
      "CHAVE LS4-BLADE-01 (307110100 )                                                 ",
    precoOriginal: 350.34,
    robOriginal: 0.535522,
  },
  "L00396              ": {
    descricao:
      "CHAVE LS4-CHRYSLER-01 ( 307110102 )                                             ",
    precoOriginal: 350.34,
    robOriginal: 0.535522,
  },
  "L00392              ": {
    descricao:
      "CHAVE LS4-NISSAN 01 ( 307110097 )                                               ",
    precoOriginal: 408.73,
    robOriginal: 0.535522,
  },
  "L00393              ": {
    descricao:
      "CHAVE LS-HYUNDAI-01 (307110098 )                                                ",
    precoOriginal: 350.34,
    robOriginal: 0.535522,
  },
  "00445": {
    descricao: "CONECTOR DBS CAR P/ X-431 PADIII V1.0 sn98569",
    precoOriginal: 3515.36,
    robOriginal: 0.633508,
  },
  "00446": {
    descricao: "CONECTOR DBS CAR P/ X-431 PADIII V2.0 sn98982",
    precoOriginal: 3663.69,
    robOriginal: 0.645249,
  },
  "00450": {
    descricao: "CONECTOR DBS CAR P/ X-431 PADV - Smartbox sn98989",
    precoOriginal: 10483.6,
    robOriginal: 0.599366,
  },
  301050494: {
    descricao: "CONECTOR DBS CAR P/ X-431 PRO GT - dbscar IV",
    precoOriginal: 3360.28,
    robOriginal: 0.620125,
  },
  301190201: {
    descricao:
      "CONECTOR DBS CAR P/ X-431 PRO V3.0 antes junho 2018 - dbscar4 sn98539",
    precoOriginal: 2028.87,
    robOriginal: 0.532697,
  },
  301190595: {
    descricao: "CONECTOR DBS CAR P/ X-431 PRO V4.0 - dbscar IV - sn98951",
    precoOriginal: 3430.46,
    robOriginal: 0.626331,
  },
  L00209: {
    descricao:
      "CONJUNTO DE CONECTORES PARA SCANNER DE DIAGNÓSTICO VEÍCULOS OBDI E OUTROS LAUNCH",
    precoOriginal: 2085.3,
    robOriginal: 0.488955,
  },
  L00926: {
    descricao: "CREADER CRE926 SCANNER UNIVERSAL LAUNCH",
    precoOriginal: 770.46,
    robOriginal: 0.482454,
  },
  L00936: {
    descricao: "CREADER CRE936 SCANNER UNIVERSAL LAUNCH",
    precoOriginal: 997.5,
    robOriginal: 0.58284,
  },
  "LIC-DATA-SRV": {
    descricao:
      "DATA LAUNCH IBÉRICA - LICENÇA DE USO ANUAL PARA ACESSO À INFORMAÇÕES TECNICAS - 4 USUÁRIOS",
    precoOriginal: 9276.0,
    robOriginal: 0.67279,
  },
  "25007FTC": {
    descricao:
      "DESMONTADORA DE PNEUS FORTA TECH GRIP 500 - GP500 - CINZA 7016                               ",
    precoOriginal: 15650.0,
    robOriginal: 0.558174,
  },
  "25006FTC": {
    descricao:
      "DESMONTADORA DE PNEUS FORTA TECH GRIP 500 - GP500 - VERMELHA                        ",
    precoOriginal: 15650.0,
    robOriginal: 0.558174,
  },
  "25017FTC": {
    descricao:
      "DESMONTADORA DE PNEUS FORTA TECH GRIP ECO 300 - GP300 - CINZA 7016                                   ",
    precoOriginal: 9090.0,
    robOriginal: 0.450273,
  },
  "25018FTC": {
    descricao:
      "DESMONTADORA DE PNEUS FORTA TECH GRIP ECO 300 - GP300 - VERMELHA                                   ",
    precoOriginal: 9090.0,
    robOriginal: 0.450273,
  },
  "25010FTC": {
    descricao:
      "DESMONTADORA DE PNEUS FORTA TECH GRIP ELITE X1 - GPX1 - CINZA 7016                             ",
    precoOriginal: 27195.0,
    robOriginal: 0.477,
  },
  "25009FTC": {
    descricao:
      "DESMONTADORA DE PNEUS FORTA TECH GRIP SMART 900 - GP 900 - CINZA 7016",
    precoOriginal: 20947.5,
    robOriginal: 0.476402,
  },
  "25008FTC": {
    descricao:
      "DESMONTADORA DE PNEUS FORTA TECH GRIP SMART 900 - GP 900 - VERMELHA                  ",
    precoOriginal: 20947.5,
    robOriginal: 0.476402,
  },
  L00312: {
    descricao:
      "DIAGNÓSTICO DE HEMERTICIDADE DE BATERIAS DE VEÍCULOS ELÉTRICOS - ISMARTEV ET30",
    precoOriginal: 25611.3,
    robOriginal: 0.490081,
  },
  "240099FTC": {
    descricao:
      "ELEVADOR ELÉTRICO COM MESA FORTA TECH ELEVA EEV15 PARA BATERIAS DE VHE 1.5TON CINZA",
    precoOriginal: 19052.08,
    robOriginal: 0.423348,
  },
  "240092FT": {
    descricao:
      "ELEVADOR HIDRAULICO FORTA TECH ELEVA EB452 BASE INFERIOR 2 DESTRAV. 4.5 TON VERMELHO    ",
    precoOriginal: 16790.0,
    robOriginal: 0.407853,
  },
  "240093FT": {
    descricao:
      "ELEVADOR HIDRAULICO FORTA TECH ELEVA EBB452 BASE INFERIOR - 3 ESTAG. C/PAINEL 4.5T - CINZ",
    precoOriginal: 19950.0,
    robOriginal: 0.377625,
  },
  "240094FT": {
    descricao:
      "ELEVADOR HIDRAULICO FORTA TECH ELEVA EP452 PÓRTICO 2 DESTRAV. 4.5 TON VERMELHO          ",
    precoOriginal: 17990.0,
    robOriginal: 0.415008,
  },
  FT24006: {
    descricao: "ELEVADOR HIDRAULICO FORTA TECH ELEVA EP502 PÓRTICO 5TON CINZA",
    precoOriginal: 34500.0,
    robOriginal: 0.403927,
  },
  "240095FT": {
    descricao:
      "ELEVADOR HIDRAULICO FORTA TECH ELEVA EPP452 PÓRTICO - 3 ESTAG. C/PAINEL 4.5T - CINZA 7040",
    precoOriginal: 22400.0,
    robOriginal: 0.403298,
  },
  "25011FTC": {
    descricao:
      "ELEVADOR HIDRAULICO FORTA TECH ELEVA EPP602 PÓRTICO 6TON C/PAINEL CINZA 7040",
    precoOriginal: 35980.0,
    robOriginal: 0.415008,
  },
  "25012FTC": {
    descricao:
      "ELEVADOR PANTOGRAFICO FORTA TECH ELEVA P/ EMBUTIR NO SOLO 4 TON MODELO ETZ40E CINZA 7016                 ",
    precoOriginal: 27600.0,
    robOriginal: 0.410556,
  },
  "240096FTC": {
    descricao:
      "ELEVADOR PANTOGRAFICO P/ INSTAL. SOBRE O SOLO FORTA TECH ELEVA ETZ30SS 3.0T CINZA RAL 70",
    precoOriginal: 33500.0,
    robOriginal: 0.403371,
  },
  L00241: {
    descricao:
      "EQUALIZADOR DE PACK DE CÉLULAS DE BATERIAS DE VEÍCULOS ELÉTRICOS 24 CANAIS - ISMARTEV EB240",
    precoOriginal: 66642.74,
    robOriginal: 0.482485,
  },
  L00242: {
    descricao:
      "EQUIPAMENTO PARA DESCARREGAR E CARREGAR PACKS DE BATERIAS DE VEÍCULOS ELÉTRICOS 26 CANAIS ISMARTEV EP260",
    precoOriginal: 91469.98,
    robOriginal: 0.482482,
  },
  "25013FTC": {
    descricao:
      "EQUIPAMENTO PARA TESTE E LIMP. DE BICO INJETOR GDI CNC 605 PLUS LAUNCH/SMARTSAFE  PARA PIEZO ELETRICO",
    precoOriginal: 13230.0,
    robOriginal: 0.442277,
  },
  L00452: {
    descricao:
      "EQUIPAMENTO PARA TESTE E LIMPEZA DE BICO INJETOR CNC 603 LITE SMARTSAFE",
    precoOriginal: 3990.0,
    robOriginal: 0.377625,
  },
  "25014FTC": {
    descricao:
      "EQUIPAMENTO PARA TESTE E LIMPEZA DE BICO INJETOR GDI 4i FORTA TECH PULSE ECO 300 - PU300",
    precoOriginal: 4736.35,
    robOriginal: 0.44407,
  },
  "25015FTC": {
    descricao:
      "EQUIPAMENTO PARA TESTE E LIMPEZA DE BICO INJETOR GDI 6i  FORTA TECH PULSE 500 - PU500",
    precoOriginal: 6947.73,
    robOriginal: 0.443941,
  },
  L00605: {
    descricao:
      "EQUIPAMENTO PARA TESTE E LIMPEZA DE BICO INJETOR GDi CNC 605A LAUNCH/SMARTSAFE",
    precoOriginal: 8487.0,
    robOriginal: 0.410893,
  },
  "00501EX": {
    descricao: "EQUIPAMENTO PARA TROCA DE FLUIDO DE ATF CAT-501S LAUNCH",
    precoOriginal: 18298.0,
    robOriginal: 0.419663,
  },
  "100CMBV": {
    descricao: "EQUIPAMENTO PARA TROCA DE FLUIDO DE ATF CM-100 TEKTINO",
    precoOriginal: 13990.0,
    robOriginal: 0.430311,
  },
  "104CMBV": {
    descricao: "EQUIPAMENTO PARA TROCA DE FLUIDO DE ATF CM-104 TEKTINO",
    precoOriginal: 20900.0,
    robOriginal: 0.416789,
  },
  "25025FTC": {
    descricao:
      "EQUIPAMENTO PARA TROCA DE FLUIDO DE ATF FLUID 500 - FORTA TECH - FL500",
    precoOriginal: 12463.5,
    robOriginal: 0.507165,
  },
  "25026FTC": {
    descricao:
      "EQUIPAMENTO PARA TROCA DE LIQUIDO DE ARREFECIMENTO FORTA TECH THERMO ELITE X1 - THX1",
    precoOriginal: 10679.61,
    robOriginal: 0.468826,
  },
  "25003FTC": {
    descricao: "EXTENSÃO PARA SAPATA DE ELEVADOR DE 100MM PARA EB452 E EP452",
    precoOriginal: 485.73,
    robOriginal: 0.616043,
  },
  L00309: {
    descricao:
      "FONTE ESTABILIZADORA DE BATERIAS DE VEICULOS ELÉTRICOS ALTA E BAIXA TENSÃO - ISMARTEV DP750",
    precoOriginal: 21979.87,
    robOriginal: 0.506623,
  },
  "25019FTC": {
    descricao:
      "GATILHO DISPENSADOR INTELIGENTE+ MANGUEIRA - FORTA TECH FLOW SMART 900 - FLO900",
    precoOriginal: 4893.71,
    robOriginal: 0.472154,
  },
  L00501: {
    descricao:
      "GERADORA DE FUMAÇA PARA DETECÇÃO DE VAZAMENTOS LAUNCH SLD-501 TURBO",
    precoOriginal: 3990.0,
    robOriginal: 0.449365,
  },
  L00322: {
    descricao:
      "ISMARTLINK D01 - SCANNER PROFISSIONAL PARA PROGRAMAÇÕES ON-LINE E DIAGNÓSTICO",
    precoOriginal: 23791.05,
    robOriginal: 0,
  },
  L00201: {
    descricao:
      "ISMARTTOOL 601 MAX - SCANNER PROFISSIONAL DE DIAGNÓSTICO (BATTERY, TPMS, DIAGNOSE, PRINTING)",
    precoOriginal: 10640.22,
    robOriginal: 0,
  },
  "25002FTC": {
    descricao:
      "KIT 4 UNIDADES DE SAPATA FORTA TECH TIPO U COM BORRACHA (EV) PARA ELEV. EB452 E EP452",
    precoOriginal: 837.9,
    robOriginal: 0.615361,
  },
  "25001FTC": {
    descricao:
      "KIT 4 UNIDADES DE SAPATA FORTA TECH TIPO U SEM BORRACHA PARA ELEV. EB452 E EP452",
    precoOriginal: 498.75,
    robOriginal: 0.487012,
  },
  "25020FTC": {
    descricao:
      "KIT BOMBA ELÉTRICA + GATILHO INTELIGENTE + MANGUEIRAS + TBOX+PESCADOR PARA 208L FORTA TECH FLOW ELITE X1 - FWX1",
    precoOriginal: 6970.0,
    robOriginal: 0.453846,
  },
  "25020FTCa": {
    descricao:
      "KIT BOMBA ELÉTRICA + GATILHO INTELIGENTE + MANGUEIRAS + TBOX+PESCADOR PARA 60L FT-60 FORTA TECH FLOW ELITE X2 - FWX2",
    precoOriginal: 6970.0,
    robOriginal: 0.453846,
  },
  "25027FTC": {
    descricao:
      "KIT COM 110 ADAPTADORES PARA ATF COM MALETA FORTA TECH FLUID 110 - FLU110",
    precoOriginal: 6457.5,
    robOriginal: 0.578839,
  },
  "CB-ADAP4": {
    descricao:
      "KIT COM 14 ADAPTADORES PARA TROCA DE FLUIDO DE ATF (ref na lista: AZUL)",
    precoOriginal: 5963.13,
    robOriginal: 0.8435,
  },
  "25016FTC": {
    descricao:
      "KIT COM 140 ADAPTADORES PARA ATF COM MALETA FORTA TECH FLUID 140 - FLU140",
    precoOriginal: 7245.0,
    robOriginal: 0.731501,
  },
  "CB-ADAP5": {
    descricao:
      "KIT COM 22 ADAPTADORES PARA TROCA DE FLUIDO DE ATF (ref na lista: AZUL E LARANJA)",
    precoOriginal: 9414.07,
    robOriginal: 0.8435,
  },
  "CB-ADAP6": {
    descricao:
      "KIT COM 48 ADAPTADORES PARA TROCA DE FLUIDO DE ATF ( ref na lista: AZUL, LARANJA E BRANCO)",
    precoOriginal: 20704.17,
    robOriginal: 0.8435,
  },
  L00348: {
    descricao: "KIT COM 90 ADAPTADORES PARA ATF COM MALETA IMPORTADA",
    precoOriginal: 5950.0,
    robOriginal: 0.542762,
  },
  "20025FTC": {
    descricao:
      "KIT DE BATERIA PARA BOMBA ELÉTRICA PORTÁTIL FORTA TECH FLOW 100 - FW100",
    precoOriginal: 3834.78,
    robOriginal: 0.472168,
  },
  L00385: {
    descricao: "KIT DE CABOS PARA CARROS ELÉTRICOS PARA SCANNERS DA LAUNCH",
    precoOriginal: 6900.0,
    robOriginal: 0.422384,
  },
  INN110: {
    descricao:
      "KIT NACIONAL SUPORTE P/ CHASSI DE PICK-UPS (2 UNID. QUADRADAS TIPO U +  2 UNID. REDONDAS) 200MM   ",
    precoOriginal: 1793.3,
    robOriginal: 0.532715,
  },
  INN105: {
    descricao:
      "KIT NACIONAL SUPORTE P/ CHASSI DE PICK-UPS QUADRADO TIPO U (4 UN 200MM)                  ",
    precoOriginal: 1793.3,
    robOriginal: 0.532715,
  },
  INN104: {
    descricao:
      "KIT NACIONAL SUPORTE PARA CHASSI DE PICK-UPS REDONDO COMPOSTO DE 4 UN                    ",
    precoOriginal: 1793.3,
    robOriginal: 0.532715,
  },
  "LIC-431IMMO-SRV": {
    descricao:
      "LICENÇA DE USO PARA SOFTWARE ADICIONAL DE IMOBILIZADOR PARA IMMOPAD E PRO",
    precoOriginal: 7856.07,
    robOriginal: 0.651032,
  },
  "LIC-UPDASMA-SRV": {
    descricao:
      "LICENÇA FULL ANUAL PARA USO DA PLATAFORMA SMARTLINK PARA B OU C - 12 MESES",
    precoOriginal: 10603.04,
    robOriginal: 0.85321,
  },
  "LIC-10CSMARTAB": {
    descricao:
      "LICENÇA PARA 10 CRÉDITOS DE USO NA PLATAFORMA SMARTLINK PARA A OU B",
    precoOriginal: 1042.79,
    robOriginal: 0.576274,
  },
  "LIC-20CSMARTAB": {
    descricao:
      "LICENÇA PARA 20 CRÉDITOS DE USO NA PLATAFORMA SMARTLINK PARA A OU B",
    precoOriginal: 1570.27,
    robOriginal: 0.577695,
  },
  "LIC-50CSMARTAB": {
    descricao:
      "LICENÇA PARA 50 CRÉDITOS DE USO NA PLATAFORMA SMARTLINK PARA A OU B",
    precoOriginal: 3142.16,
    robOriginal: 0.577884,
  },
  INN023: {
    descricao: "MACACO PNEUMATICO RODA LIVRE 2 TON. FORTA TECH-MP2000 NACIONAL",
    precoOriginal: 4417.48,
    robOriginal: 0.449236,
  },
  MP0000: {
    descricao:
      "MALETA PARA ACOMODAÇÃO DE CONEXOES E ADAPTADORES DE ATF - ÉLIUS",
    precoOriginal: 484.37,
    robOriginal: 0.743915,
  },
  "20023FTC": {
    descricao:
      "MONITOR DE NÍVEL DE LUBRIFICANTE - FT-NIVEL FORTA TECH FLOW 500 - FW500",
    precoOriginal: 3950.0,
    robOriginal: 0.430276,
  },
  "20022FTC": {
    descricao:
      "MONITOR DE NÍVEL DE LUBRIFICANTE COM CAIXA DE CONTROLE SONORO - ALARM FORTA TECH FLOW SMART 900 - FW900",
    precoOriginal: 2950.0,
    robOriginal: 0.412827,
  },
  L00311: {
    descricao: "OSCILOSCOPIO DOIS CANAIS E MULTIMETRO PARA EV - ISMARTEV OM210",
    precoOriginal: 6086.07,
    robOriginal: 0.532663,
  },
  L00187: {
    descricao:
      "OSCILOSCÓPIO LAUNCH O2-2 PARA X-431 PRO1S VERSÃO 5.0 E MODELOS ACIMA",
    precoOriginal: 8379.0,
    robOriginal: 0.450361,
  },
  L00243: {
    descricao:
      "PINÇA DE TESTE DE CORRENTE E VOLTAGEM C/ DISPLAY  SMARTSAFE- ISMARTEV EC100 ",
    precoOriginal: 4345.38,
    robOriginal: 0.5325,
  },
  INN024: {
    descricao: "PRATOS DESLIZANTES TRASEIROS PARA ALINHAMENTO (2 PEÇAS)",
    precoOriginal: 6659.56,
    robOriginal: 0.346599,
  },
  L00356: {
    descricao: "RAMPA COM MEDIÇÃO DE PNEUS INTEGRADA TTM 600 SMARTSAFE",
    precoOriginal: 86124.79,
    robOriginal: 0.535868,
  },
  INN032: {
    descricao:
      "RAMPA PNEUMATICA PARA ALINHAMENTO - SHER TILE FORTA TECH RTP4000 NACIONAL - NACIONAL",
    precoOriginal: 37420.29,
    robOriginal: 0.34704,
  },
  INN033: {
    descricao:
      "RAMPA PNEUMATICA PARA ALINHAMENTO - SHER TILE FORTA TECH RTP5000 ALONGADA - NACIONAL",
    precoOriginal: 38589.72,
    robOriginal: 0.347041,
  },
  L00101: {
    descricao: "RECICLADORA DE AR CONDICIONADO VALUE-500 220V LAUNCH",
    precoOriginal: 22900.0,
    robOriginal: 0.433015,
  },
  "00041": {
    descricao: "S2-2 SENSORBOX PARA X-431 PRO1S VERSÃO 5.0 E MODELOS ACIMA",
    precoOriginal: 5003.29,
    robOriginal: 0.47072,
  },
  L00365: {
    descricao: "SCANNER HANDHELD PARA MEDIÇÃO DE PNEUS TTM 113 SMARTSAFE",
    precoOriginal: 5241.8,
    robOriginal: 0.498904,
  },
  L00240: {
    descricao:
      "SCANNER PARA DIAGNÓSTICO DE BATERIAS DE VEÍCULOS ELÉTRICOS - ISMARTEV P01",
    precoOriginal: 32512.44,
    robOriginal: 0.60995,
  },
  L00308: {
    descricao:
      "SCANNER PARA DIAGNÓSTICO DE BATERIAS DE VEÍCULOS ELÉTRICOS COM OSCILOSCÓPIO - ISMARTEV P03",
    precoOriginal: 57221.78,
    robOriginal: 0.61668,
  },
  L00511: {
    descricao: "SCANNER TPMS CRT 511 LAUNCH",
    precoOriginal: 3248.7,
    robOriginal: 0.574839,
  },
  L00122: {
    descricao:
      "SCANNER TPMS TSGUN PARA X-431 PRO1SV.4.0 OU MODELOS ACIMA - LAUNCH",
    precoOriginal: 2318.4,
    robOriginal: 0.532646,
  },
  L00102: {
    descricao: "SUPORTE MÓVEL RACK TWT-100 LAUNCH",
    precoOriginal: 5566.93,
    robOriginal: 0.492381,
  },
  301180741: {
    descricao: "TABLET P/ X-431 PAD V",
    precoOriginal: 17205.59,
    robOriginal: 0.395029,
  },
  301190200: {
    descricao: "TABLET P/ X-431 PRO V1.0 ATÉ V3.0 / SCANPAD 071 CHN / USA",
    precoOriginal: 3946.28,
    robOriginal: 0.449903,
  },
  301190605: {
    descricao: "TABLET P/ X-431 PRO V4.0",
    precoOriginal: 3940.6,
    robOriginal: 0.44922,
  },
  INN300: {
    descricao: "TAPETE ANTIDERRAPANTE PARA ELEVADORES COM LOGOTIPO LAUNCH",
    precoOriginal: 2570.39,
    robOriginal: 0.414239,
  },
  INN303: {
    descricao: "TAPETE ANTIDERRAPANTE PARA ELEVADORES SEM LOGOTIPO",
    precoOriginal: 2570.39,
    robOriginal: 0.414239,
  },
  L00195: {
    descricao: "TERMOMETRO CAMERA TÉRMICA INFRAVERMELHO LAUNCH TIT-202",
    precoOriginal: 9380.04,
    robOriginal: 0.482741,
  },
  L00120: {
    descricao: "TESTADOR DE BATERIA BST 360 LAUNCH",
    precoOriginal: 850.0,
    robOriginal: 0.500512,
  },
  L00344: {
    descricao: "TESTADOR DE BATERIA BST 560S LAUNCH",
    precoOriginal: 950.0,
    robOriginal: 0.450422,
  },
  L00204: {
    descricao: "TESTADOR DE BATERIA BST 580D LAUNCH",
    precoOriginal: 1590.0,
    robOriginal: 0.534847,
  },
  L00345: {
    descricao: "TESTADOR DE BATERIA BST 860S LAUNCH",
    precoOriginal: 1990.0,
    robOriginal: 0.435167,
  },
  L00310: {
    descricao:
      "TESTE DE RESISTENCIA E ISOLAMENTO PARA VEICULOS ELETRICOS - (TIME/AC/DC) - ISMARTEV RT100",
    precoOriginal: 9156.56,
    robOriginal: 0.564761,
  },
  "00317": {
    descricao: "TROCA DE ÓLEO A VACUO TOC 317 LAUNCH",
    precoOriginal: 3490.0,
    robOriginal: 0.441337,
  },
  L00208: {
    descricao: "VALVULA TPMS DE METAL LTR-03 LAUNCH",
    precoOriginal: 300.3,
    robOriginal: 0.493232,
  },
  L00247: {
    descricao: "X-431 ADAS AVM CADILLAC - LAC04-06",
    precoOriginal: 2261.31,
    robOriginal: 0.522778,
  },
  L00248: {
    descricao: "X-431 ADAS AVM FORD - LAC04-07",
    precoOriginal: 13567.87,
    robOriginal: 0.522778,
  },
  L00249: {
    descricao: "X-431 ADAS AVM HONDA - LAC04-01/LAC04-02",
    precoOriginal: 4239.96,
    robOriginal: 0.522778,
  },
  L00250: {
    descricao: "X-431 ADAS AVM HYUNDAI - LAC04-12-01/LAC4-12-02",
    precoOriginal: 13002.54,
    robOriginal: 0.522778,
  },
  "00464               ": {
    descricao: "X-431 ADAS AVM MITSUBISHI - LAC04-13",
    precoOriginal: 3391.97,
    robOriginal: 0.522778,
  },
  L00251: {
    descricao: "X-431 ADAS AVM PORSCHE -AVM LAC04-05",
    precoOriginal: 7349.26,
    robOriginal: 0.522778,
  },
  L00252: {
    descricao: "X-431 ADAS AVM RENAULT - LAC04-10-01/LAC04-10-02",
    precoOriginal: 5653.28,
    robOriginal: 0.522778,
  },
  L00253: {
    descricao: "X-431 ADAS AVM TOYOTA - LAC04-16",
    precoOriginal: 2261.31,
    robOriginal: 0.522778,
  },
  L00254: {
    descricao: "X-431 ADAS AVM TOYOTA - LAC04-28",
    precoOriginal: 1413.32,
    robOriginal: 0.522778,
  },
  L00255: {
    descricao: "X-431 ADAS AVM TOYOTA - LAC04-29",
    precoOriginal: 4522.62,
    robOriginal: 0.522778,
  },
  "00472               ": {
    descricao: "X-431 ADAS AVM VOLKSWAGEN - LAC04-14",
    precoOriginal: 6783.93,
    robOriginal: 0.522778,
  },
  "00436": {
    descricao: "X-431 ADAS CORNER REFLECTOR LAC05-03",
    precoOriginal: 7135.51,
    robOriginal: 0.532496,
  },
  "00452": {
    descricao: "X-431 ADAS DOPLER SIMULATOR (LAC05-04)",
    precoOriginal: 9514.01,
    robOriginal: 0.532496,
  },
  L00256: {
    descricao: "X-431 ADAS HD  CONFIGURAÇÃO STANDARD",
    precoOriginal: 118859.76,
    robOriginal: 0.532281,
  },
  L00257: {
    descricao: "X-431 ADAS HD ISUZU SINGLE TARGET CONFIGURATION LAH01-03",
    precoOriginal: 8197.25,
    robOriginal: 0.522778,
  },
  L00258: {
    descricao:
      "X-431 ADAS HD IVECO/MAN/SCANIA SINGLE TARGET CONFIGURATION LAH01-01",
    precoOriginal: 7349.26,
    robOriginal: 0.522778,
  },
  L00259: {
    descricao: "X-431 ADAS HD UD/NISSAN SINGLE TARGET CONFIGURATION LAH01-04",
    precoOriginal: 6501.27,
    robOriginal: 0.522778,
  },
  L00260: {
    descricao:
      "X-431 ADAS HD VOLVO/RENAULT SINGLE TARGET CONFIGURATION LAH01-02",
    precoOriginal: 10741.23,
    robOriginal: 0.522778,
  },
  L00261: {
    descricao: "X-431 ADAS KIT DE CALIBRAÇÃO DE RADAR",
    precoOriginal: 12719.87,
    robOriginal: 0.522778,
  },
  L00262: {
    descricao: "X-431 ADAS LDW HONDA - LAC04-17",
    precoOriginal: 10175.9,
    robOriginal: 0.522778,
  },
  "00460": {
    descricao: "X-431 ADAS LDW KIA/Hyundai - LAC01-13",
    precoOriginal: 1130.66,
    robOriginal: 0.522778,
  },
  L00263: {
    descricao: "X-431 ADAS LDW TOYOTA -LAM01-06-4",
    precoOriginal: 3391.97,
    robOriginal: 0.522778,
  },
  L00264: {
    descricao: "X-431 ADAS LIDAR TARGET VOLKSWAGEN/Audi- LAC05-06",
    precoOriginal: 16959.83,
    robOriginal: 0.522778,
  },
  L00338: {
    descricao:
      "X-431 ADAS LITE CONFIGURAÇÃO BÁSICA + LAM 05-03 (CORNER) + ACC + LAM 01-02 (VW)",
    precoOriginal: 45052.95,
    robOriginal: 0.523553,
  },
  "L00198              ": {
    descricao: "X-431 ADAS MOBILE ACC REFLECTOR - LAM05-02",
    precoOriginal: 26711.74,
    robOriginal: 0.522778,
  },
  L00265: {
    descricao:
      "X-431 ADAS MOBILE ADAS CAIXA DE ALUMINIO PARA ACESSÓRIOS (OPCIONAL)",
    precoOriginal: 2543.97,
    robOriginal: 0.522778,
  },
  L00266: {
    descricao:
      "X-431 ADAS MOBILE CAIXA DE ALUMINIO PARA ACC REFLECTOR (OPCIONAL)",
    precoOriginal: 2261.31,
    robOriginal: 0.522778,
  },
  L00267: {
    descricao:
      "X-431 ADAS MOBILE CAIXA DE ALUMINIO PARA PAINEL PRINCIPAL (OPCIONAL)",
    precoOriginal: 7349.26,
    robOriginal: 0.522778,
  },
  L00268: {
    descricao:
      "X-431 ADAS MOBILE CAIXA DE ALUMINIO PARA PLACA DE MONTAGEM (OPCIONAL)",
    precoOriginal: 2261.31,
    robOriginal: 0.522778,
  },
  "L00197              ": {
    descricao: "X-431 ADAS MOBILE CONFIGURAÇÃO BASICA (SEM PAINEIS)",
    precoOriginal: 65302.19,
    robOriginal: 0.531858,
  },
  L00269: {
    descricao: "X-431 ADAS MOBILE CONFIGURAÇÃO DELUXE",
    precoOriginal: 127625.81,
    robOriginal: 0.531826,
  },
  L00270: {
    descricao: "X-431 ADAS MOBILE CONFIGURAÇÃO STANDARD",
    precoOriginal: 94897.09,
    robOriginal: 0.531495,
  },
  L00271: {
    descricao: "X-431 ADAS MOBILE HASTE DE EXTENSÃO ROD I LAM09-08",
    precoOriginal: 1413.32,
    robOriginal: 0.522778,
  },
  L00272: {
    descricao: "X-431 ADAS MOBILE HASTE DE EXTENSÃO ROD II LAM09-09",
    precoOriginal: 1413.32,
    robOriginal: 0.522778,
  },
  L00273: {
    descricao: "X-431 ADAS MOBILE LDW - MITSUBISHI - LAM01-19-R",
    precoOriginal: 1695.98,
    robOriginal: 0.522778,
  },
  L00274: {
    descricao: "X-431 ADAS MOBILE LDW - SUZUKI - LAM01-25",
    precoOriginal: 8479.92,
    robOriginal: 0.522778,
  },
  "00453               ": {
    descricao: "X-431 ADAS MOBILE LDW ALFA ROMEO / NISSAN - LAM01-11",
    precoOriginal: 5653.28,
    robOriginal: 0.522778,
  },
  L00275: {
    descricao: "X-431 ADAS MOBILE LDW HONDA - LAM01-04-L",
    precoOriginal: 2543.97,
    robOriginal: 0.522778,
  },
  L00276: {
    descricao: "X-431 ADAS MOBILE LDW HONDA - LAM01-04-R",
    precoOriginal: 2543.97,
    robOriginal: 0.522778,
  },
  L00277: {
    descricao: "X-431 ADAS MOBILE LDW HONDA - LAM01-17",
    precoOriginal: 1695.98,
    robOriginal: 0.522778,
  },
  "00458               ": {
    descricao: "X-431 ADAS MOBILE LDW HONDA - LAM01-20",
    precoOriginal: 2543.97,
    robOriginal: 0.522778,
  },
  L00278: {
    descricao: "X-431 ADAS MOBILE LDW HYUNDAI/KIA - LAM01-09",
    precoOriginal: 5087.95,
    robOriginal: 0.522778,
  },
  L00279: {
    descricao: "X-431 ADAS MOBILE LDW MAZDA - LAM01-10",
    precoOriginal: 2543.97,
    robOriginal: 0.522778,
  },
  L00280: {
    descricao: "X-431 ADAS MOBILE LDW MAZDA - LAM01-16-L",
    precoOriginal: 2543.97,
    robOriginal: 0.522778,
  },
  L00281: {
    descricao: "X-431 ADAS MOBILE LDW MAZDA - LAM01-16-R",
    precoOriginal: 2543.97,
    robOriginal: 0.522778,
  },
  L00282: {
    descricao: "X-431 ADAS MOBILE LDW MERCEDES -  LAM01-01",
    precoOriginal: 2543.97,
    robOriginal: 0.522778,
  },
  L00283: {
    descricao: "X-431 ADAS MOBILE LDW MITSUBISHI - LAM01-19-L",
    precoOriginal: 1695.98,
    robOriginal: 0.522778,
  },
  L00284: {
    descricao: "X-431 ADAS MOBILE LDW NISSAN - LAM01-07-L",
    precoOriginal: 2543.97,
    robOriginal: 0.522778,
  },
  L00285: {
    descricao: "X-431 ADAS MOBILE LDW NISSAN - LAM01-07-R",
    precoOriginal: 2543.97,
    robOriginal: 0.522778,
  },
  L00286: {
    descricao: "X-431 ADAS MOBILE LDW NISSAN/RENAULT - LAM01-12-L",
    precoOriginal: 1695.98,
    robOriginal: 0.522778,
  },
  L00287: {
    descricao: "X-431 ADAS MOBILE LDW NISSAN/RENAULT - LAM01-12-R",
    precoOriginal: 1695.98,
    robOriginal: 0.522778,
  },
  L00288: {
    descricao: "X-431 ADAS MOBILE LDW SPRINTER - LAM01-23-L",
    precoOriginal: 2543.97,
    robOriginal: 0.522778,
  },
  L00289: {
    descricao: "X-431 ADAS MOBILE LDW SPRINTER - LAM01-23-R",
    precoOriginal: 2543.97,
    robOriginal: 0.522778,
  },
  L00290: {
    descricao: "X-431 ADAS MOBILE LDW SUBARU - LAM01-15",
    precoOriginal: 8479.92,
    robOriginal: 0.522778,
  },
  L00291: {
    descricao: "X-431 ADAS MOBILE LDW SUBARU - LAM01-21",
    precoOriginal: 8479.92,
    robOriginal: 0.522778,
  },
  L00292: {
    descricao: "X-431 ADAS MOBILE LDW SUZUKI - LAM01-18-L",
    precoOriginal: 1695.98,
    robOriginal: 0.522778,
  },
  L00293: {
    descricao: "X-431 ADAS MOBILE LDW SUZUKI - LAM01-18-R",
    precoOriginal: 1695.98,
    robOriginal: 0.522778,
  },
  L00294: {
    descricao: "X-431 ADAS MOBILE LDW TOYOTA - LAM01-06-1",
    precoOriginal: 1695.98,
    robOriginal: 0.522778,
  },
  L00295: {
    descricao: "X-431 ADAS MOBILE LDW TOYOTA - LAM01-06-2",
    precoOriginal: 1695.98,
    robOriginal: 0.522778,
  },
  L00296: {
    descricao: "X-431 ADAS MOBILE LDW TOYOTA - LAM01-06-3",
    precoOriginal: 1695.98,
    robOriginal: 0.522778,
  },
  "00443               ": {
    descricao: "X-431 ADAS MOBILE LDW VOLKSWAGEN/AUDI LAM01-02",
    precoOriginal: 5653.28,
    robOriginal: 0.522778,
  },
  L00297: {
    descricao: "X-431 ADAS NV - VOLKSWAGEN - LAC06-01",
    precoOriginal: 9893.24,
    robOriginal: 0.522778,
  },
  L00298: {
    descricao: "X-431 ADAS NV MERCEDES - LAC06-02",
    precoOriginal: 11306.56,
    robOriginal: 0.522778,
  },
  "00438": {
    descricao:
      "X-431 ADAS PRO KIT AMERICANO  P/ CALIBRAGEM DE CAMERA TRASEIRA E 360  (307010024)",
    precoOriginal: 20811.89,
    robOriginal: 0.532496,
  },
  "00439": {
    descricao:
      "X-431 ADAS PRO KIT ASIATICO P/ CALIBRAGEM DE CAMERA TRASEIRA E 360  (307010023)",
    precoOriginal: 23785.02,
    robOriginal: 0.532496,
  },
  "00437": {
    descricao:
      "X-431 ADAS PRO KIT EUROPEU P/ CALIBRAGEM DE CAMERA TRASEIRA E 360  (307010025)",
    precoOriginal: 28244.71,
    robOriginal: 0.532496,
  },
  "L00192              ": {
    descricao: "X-431 ADAS PRO+ ACESSÓRIO ACC REFLECTOR LAM05-02",
    precoOriginal: 26711.74,
    robOriginal: 0.522778,
  },
  "L00191              ": {
    descricao: "X-431 ADAS PRO+ CONFIGURAÇÃO BÁSICA",
    precoOriginal: 83125.36,
    robOriginal: 0.531922,
  },
  "L00196              ": {
    descricao: "X-431 ADAS PRO+ CONFIGURAÇÃO STANDARD",
    precoOriginal: 127625.81,
    robOriginal: 0.531826,
  },
  L00299: {
    descricao: "X-431 ADAS PRO+ OVERSEAS CONFIGURAÇÃO DELUXE",
    precoOriginal: 192954.31,
    robOriginal: 0.531891,
  },
  L00300: {
    descricao: "X-431 ADAS PRO+ OVERSEAS CONFIGURAÇÃO PREMIUM",
    precoOriginal: 272816.77,
    robOriginal: 0.531477,
  },
  L00301: {
    descricao: "X-431 ADAS RCW MERCEDES - LAC02-02",
    precoOriginal: 1451.86,
    robOriginal: 0.533417,
  },
  L00302: {
    descricao: "X-431 ADAS RCW NISSAN - LAC04-11",
    precoOriginal: 1451.86,
    robOriginal: 0.533417,
  },
  "00465               ": {
    descricao: "X-431 ADAS RCW NISSAN - LAC04-15",
    precoOriginal: 1451.86,
    robOriginal: 0.533417,
  },
  L00303: {
    descricao: "X-431 ADAS RCW NISSAN - LAC04-24",
    precoOriginal: 1451.86,
    robOriginal: 0.533417,
  },
  L00304: {
    descricao: "X-431 ADAS RCW TOYOTA - LAC04-25",
    precoOriginal: 1451.86,
    robOriginal: 0.533417,
  },
  L00305: {
    descricao: "X-431 ADAS RCW VOLKSWAGEN/AUDI - LAC02-03",
    precoOriginal: 2322.98,
    robOriginal: 0.533417,
  },
  L00306: {
    descricao: "X-431 ADAS RCW VOLKSWAGEN/AUDI RCW LAC04-04",
    precoOriginal: 9291.93,
    robOriginal: 0.533417,
  },
  L00307: {
    descricao: "X-431 ADAS RFK MERCEDES - LAC04-08-01/LAC04-08-02",
    precoOriginal: 3484.47,
    robOriginal: 0.533417,
  },
  "L00438              ": {
    descricao:
      "X-431 ECU TCU PROGRAMER - XPROG PARA TRABALHAR COM PC  (307010282)                                            ",
    precoOriginal: 10080.0,
    robOriginal: 0.490873,
  },
  L00359EX: {
    descricao: "X-431 IMMO PAD COM X-PROG3 LAUNCH",
    precoOriginal: 42319.2,
    robOriginal: 0.496858,
  },
  L00126EX: {
    descricao: "X-431 IMMO PRO COM X-PROG3 LAUNCH",
    precoOriginal: 16995.59,
    robOriginal: 0.490298,
  },
  "L00437              ": {
    descricao:
      "X-431 KEY PROGRAMER - ANTENA ( 307110096)                                                      ",
    precoOriginal: 737.83,
    robOriginal: 0.524357,
  },
  "00517EX": {
    descricao: "X-431 PAD IIIS V3.0 LAUNCH",
    precoOriginal: 13900.0,
    robOriginal: 0.434567,
  },
  FT24007EX: {
    descricao: "X-431 PAD IX LAUNCH",
    precoOriginal: 38791.24,
    robOriginal: 0.435864,
  },
  L00512EX: {
    descricao: "X-431 PAD VII LINK COM SMARTLINK V1.0 LAUNCH",
    precoOriginal: 24900.0,
    robOriginal: 0.491347,
  },
  L00370: {
    descricao: 'X-431 PRO 3 LINK COM SMARTLINK C "SLAVE" - LAUNCH',
    precoOriginal: 19385.93,
    robOriginal: 0.445223,
  },
  L00329EX: {
    descricao: "X-431 PRO SE LAUNCH",
    precoOriginal: 9980.0,
    robOriginal: 0.446814,
  },
  "00430EX": {
    descricao: "X-431 PRO SE LITE LAUNCH",
    precoOriginal: 7568.66,
    robOriginal: 0.399704,
  },
  "00447": {
    descricao: 'X-431 SMARTLINK B "MASTER" (HARDWARE PARA ASSESSORAR) - LAUNCH',
    precoOriginal: 7829.07,
    robOriginal: 0.588326,
  },
  "00448": {
    descricao:
      'X-431 SMARTLINK C "SLAVE" (HARDWARE PARA SER ASSESSORADO) - LAUNCH',
    precoOriginal: 9886.44,
    robOriginal: 0.658075,
  },
  FT24008EX: {
    descricao: "X-431 UPGRADE PARA X-431 PAD IX LAUNCH",
    precoOriginal: 29900.0,
    robOriginal: 0.412082,
  },
  "UPGRADE PRO SE": {
    descricao: "X-431 UPGRADE PARA X-431 PRO SE LAUNCH",
    precoOriginal: 8490.0,
    robOriginal: 0.363156,
  },
  L00119: {
    descricao: 'XPROG "3" PARA IMOBILIZADOR PARA PAD III/V/VII/PRO5/PRO1sV5.0',
    precoOriginal: 7650.0,
    robOriginal: 0.405273,
  },
  L00387: {
    descricao:
      "X-PROG KIT PARA CLONAGEM DE TRANSMISSÃO AUTOMATICA (CABO 1 AO 13) - 307020127",
    precoOriginal: 3503.38,
    robOriginal: 0.535522,
  },
  L00590: {
    descricao: "X-PROG3 Adaptador cabo 1 (DQ200XX),RoHS - 307110077",
    precoOriginal: 379.53,
    robOriginal: 0.535522,
  },
  L00599: {
    descricao:
      "X-PROG3 Adaptador cabo 10 (8HP_V1(BMW/LR)/8HP_V2/8HP_V3),RoHS - 307110086",
    precoOriginal: 437.92,
    robOriginal: 0.535522,
  },
  L00600: {
    descricao: "X-PROG3 Adaptador cabo 11 (MPS6),RoHS - 307110087",
    precoOriginal: 379.53,
    robOriginal: 0.535522,
  },
  L00602: {
    descricao: "X-PROG3 Adaptador cabo 12 (DPS6),RoHS - 307110088",
    precoOriginal: 379.53,
    robOriginal: 0.535522,
  },
  L00603: {
    descricao: "X-PROG3 Adaptador cabo 13 mains (ML),RoHS - 307110089",
    precoOriginal: 379.53,
    robOriginal: 0.535522,
  },
  L00591: {
    descricao: "X-PROG3 Adaptador cabo 2 (VL381),RoHS - 307110078",
    precoOriginal: 379.53,
    robOriginal: 0.535522,
  },
  L00592: {
    descricao: "X-PROG3 Adaptador cabo 3 (DQ380),RoHS - 307110079",
    precoOriginal: 379.53,
    robOriginal: 0.535522,
  },
  L00593: {
    descricao: "X-PROG3 Adaptador cabo 4 (DQ250),RoHS - 307110080",
    precoOriginal: 379.53,
    robOriginal: 0.535522,
  },
  L00594: {
    descricao: "X-PROG3 Adaptador cabo 5 (DL501),RoHS - 307110081",
    precoOriginal: 379.53,
    robOriginal: 0.535522,
  },
  L00595: {
    descricao: "X-PROG3 Adaptador cabo 6 (DL382),RoHS - 307110082",
    precoOriginal: 379.53,
    robOriginal: 0.535522,
  },
  L00596: {
    descricao: "X-PROG3 Adaptador cabo 7 (VGS-NAG3),RoHS - 307110083",
    precoOriginal: 379.53,
    robOriginal: 0.535522,
  },
  L00597: {
    descricao: "X-PROG3 Adaptador cabo 8 (VGS2-FDCT/VGS-FDCT),RoHS - 307110084",
    precoOriginal: 379.53,
    robOriginal: 0.535522,
  },
  L00598: {
    descricao: "X-PROG3 Adaptador cabo 9 (VGS3-NAG2),RoHS - 307110085",
    precoOriginal: 379.53,
    robOriginal: 0.535522,
  },
  L00525: {
    descricao: "X-PROG3 bench mode line, RoHS - 307110141",
    precoOriginal: 496.31,
    robOriginal: 0.535522,
  },
  "L00376              ": {
    descricao:
      "X-PROG3 CABO ADAPTADOR PROGRAMADOR E SIMULADOR DE CHAVE (307140130)                   ",
    precoOriginal: 1181.06,
    robOriginal: 0.539881,
  },
  L00528: {
    descricao: "X-PROG3 matching Adaptador A, RoHS - 307110144",
    precoOriginal: 87.58,
    robOriginal: 0.664848,
  },
  L00529: {
    descricao: "X-PROG3 matching Adaptador B, RoHS - 307110145",
    precoOriginal: 87.58,
    robOriginal: 0.664848,
  },
  L00530: {
    descricao: "X-PROG3 matching Adaptador C, RoHS - 307110146",
    precoOriginal: 87.58,
    robOriginal: 0.664848,
  },
  L00531: {
    descricao: "X-PROG3 matching Adaptador D, RoHS - 307110147",
    precoOriginal: 87.58,
    robOriginal: 0.664848,
  },
  L00323: {
    descricao: "X-PROG3 MCU fly line, RoHS - 307110142",
    precoOriginal: 350.34,
    robOriginal: 0.535522,
  },
  L00604: {
    descricao:
      "X-PROG3 quarta geração de instrumento, EEPROM, line loss, RoHS - 307110143",
    precoOriginal: 496.31,
    robOriginal: 0.535522,
  },
  L00386: {
    descricao: "X-PROG3 Toyota IMMO Key Kit de Cabos - 307090079",
    precoOriginal: 875.85,
    robOriginal: 0.535522,
  },
};

// ✅ Agora sim a função App começa aqui
export default function App() {
  const [etapaTutorial, setEtapaTutorial] = useState(0);
  const blocoInicialRef = useRef(null);

  useEffect(() => {
    if (etapaTutorial === 1 && blocoInicialRef.current) {
      blocoInicialRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [etapaTutorial]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEtapaTutorial((prev) => (prev < 4 ? prev + 1 : prev));
    }, 4000);
    return () => clearTimeout(timer);
  }, [etapaTutorial]);

  const corClassificacao = (classe) => {
    switch (classe) {
      case "PERFEITO":
        return "#00cc00";
      case "IDEAL":
        return "#00ff7f";
      case "ACEITÁVEL":
        return "#b3ffcc";
      case "INADEQUADO - SOMENTE PARA CLIENTES ESTRATÉGICOS":
        return "#ffff99";
      case "RUIM - APENAS OVER ESTOQUE OU COM AUTORIZAÇÃO":
        return "#ff9999";
      case "BOM - REVENDEDORES":
        return "#33ccff";
      case "RUIM - REVENDEDORES ESTRATÉGICOS":
        return "#ffcccc";
      case "IMPORTADORES OU OVER ESTOQUE":
        return "#ffe6e6";
      case "PROIBIDO":
        return "#990000";
      default:
        return "transparent";
    }
  };

  const [blocos, setBlocos] = useState([
    {
      codigo: "",
      descricao: "",
      preco: "",
      entrada: "",
      entradaPercentual: 0,
      parcelas: 0,
      custoBase: 0,
      robBase: 0,
      quantidade: 1,
      termoBusca: "",
      mostrarSugestoes: false,
      produtoSelecionado: "",
    },
  ]);

  const adicionarBloco = () => {
    setBlocos([
      ...blocos,
      {
        codigo: "",
        descricao: "",
        preco: "",
        entrada: "",
        entradaPercentual: 0,
        parcelas: 0,
        custoBase: 0,
        robBase: 0,
        quantidade: 1,
        termoBusca: "",
      },
    ]);
  };

  const removerBloco = (index) => {
    const novos = blocos.filter((_, i) => i !== index);
    setBlocos(novos);
  };

  const atualizarCampo = (index, campo, valor) => {
    const novos = [...blocos];
    novos[index][campo] = valor;
    setBlocos(novos);
  };

  const selecionarProduto = (index, codigo) => {
    if (!codigo) {
      atualizarCampo(index, "codigo", "");
      atualizarCampo(index, "descricao", "");
      atualizarCampo(index, "preco", "");
      atualizarCampo(index, "entrada", "");
      atualizarCampo(index, "entradaPercentual", 0);
      atualizarCampo(index, "custoBase", 0);
      atualizarCampo(index, "robBase", 0);
      atualizarCampo(index, "termoBusca", "");
      return;
    }
    const produto = produtos[codigo];
    if (produto) {
      const novos = [...blocos];
      novos[index].codigo = codigo;
      novos[index].descricao = produto.descricao;
      novos[index].preco = produto.precoOriginal;
      novos[index].custoBase = produto.precoOriginal;
      novos[index].robBase = produto.robOriginal;
      novos[index].entrada = "";
      novos[index].entradaPercentual = 0;
      novos[index].termoBusca = produto.descricao;
      setBlocos(novos);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "20px auto", fontFamily: "Arial" }}>
      <h2>Simulador de ROB e Comissão</h2>

      {blocos.map((bloco, i) => {
        const preco = parseFloat(bloco.preco) || 0;
        const entrada = parseFloat(bloco.entrada) || 0;
        const parcelas = bloco.parcelas;
        const opcoesFiltradas = Object.entries(produtos).filter(([, prod]) =>
          prod.descricao
            .toLowerCase()
            .includes((bloco.termoBusca || "").toLowerCase())
        );

        const {
          valorParcela,
          saldoComJuros,
          valorTotalFinanciado,
          valorRealVenda,
          indiceEfetivo,
        } = calcularFinanciamento(preco, entrada, parcelas);

        const custoEstimado = bloco.custoBase * (1 - bloco.robBase);
        const robReal =
          valorRealVenda > 0
            ? (valorRealVenda - custoEstimado) / valorRealVenda
            : 0;

        let classificacao = "",
          comissao = 0;
        if (!bloco.codigo) classificacao = "";
        else if (robReal >= 0.5)
          (classificacao = "PERFEITO"), (comissao = 0.12);
        else if (robReal >= 0.45) (classificacao = "IDEAL"), (comissao = 0.1);
        else if (robReal >= 0.4)
          (classificacao = "ACEITÁVEL"), (comissao = 0.1);
        else if (robReal >= 0.35)
          (classificacao = "INADEQUADO - SOMENTE PARA CLIENTES ESTRATÉGICOS"),
            (comissao = 0.07);
        else if (robReal >= 0.3)
          (classificacao = "RUIM - APENAS OVER ESTOQUE OU COM AUTORIZAÇÃO"),
            (comissao = 0.04);
        else if (robReal >= 0.25)
          (classificacao = "BOM - REVENDEDORES"), (comissao = 0.01);
        else if (robReal >= 0.2)
          (classificacao = "RUIM - REVENDEDORES ESTRATÉGICOS"),
            (comissao = 0.01);
        else if (robReal >= 0.15)
          (classificacao = "IMPORTADORES OU OVER ESTOQUE"), (comissao = 0);
        else (classificacao = "PROIBIDO"), (comissao = 0);

        const valorComissao = comissao * valorRealVenda;
        const totalLinha = valorRealVenda * bloco.quantidade;

        return (
          <div
            key={i}
            style={{ border: "1px solid #ccc", padding: 15, marginBottom: 20 }}
          >
            <div style={{ position: "relative", marginBottom: 10 }}>
              <select
                value={bloco.produtoSelecionado}
                onChange={(e) => {
                  const codigo = e.target.value;
                  atualizarCampo(i, "produtoSelecionado", codigo);
                  selecionarProduto(i, codigo);
                }}
                style={{
                  marginBottom: "10px",
                  padding: "6px",
                  width: "100%",
                  backgroundColor: "#fff9c4",
                  border: "1px solid #ccc",
                }}
              >
                <option value="">Selecione um produto</option>
                {opcoesFiltradas.map(([cod, prod]) => (
                  <option key={cod} value={cod}>
                    {cod} - {prod.descricao}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Buscar produto"
                value={bloco.termoBusca || ""}
                onChange={(e) =>
                  atualizarCampo(i, "termoBusca", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "6px",
                  boxSizing: "border-box",
                }}
                onFocus={() => atualizarCampo(i, "mostrarSugestoes", true)}
                onBlur={() =>
                  setTimeout(
                    () => atualizarCampo(i, "mostrarSugestoes", false),
                    200
                  )
                }
              />

              {bloco.mostrarSugestoes && (
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    border: "1px solid #ccc",
                    maxHeight: 200,
                    overflowY: "auto",
                    backgroundColor: "#fff",
                    position: "absolute",
                    width: "100%",
                    zIndex: 10,
                  }}
                >
                  {opcoesFiltradas.map(([cod, prod]) => (
                    <li
                      key={cod}
                      style={{ padding: "6px", cursor: "pointer" }}
                      onClick={() => selecionarProduto(i, cod)}
                    >
                      {prod.descricao}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p>
              <strong>Valor de Referência:</strong>{" "}
              {formatarMoeda(bloco.custoBase)}
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                rowGap: 15,
                justifyContent: "flex-start",
              }}
            >
              <input
                type="text"
                placeholder="Valor Desejado"
                value={bloco.inputText ?? bloco.preco ?? ""}
                onChange={(e) => {
                  const texto = e.target.value;
                  atualizarCampo(i, "inputText", texto);

                  const numero = parseFloat(
                    texto.replace(/\./g, "").replace(",", ".")
                  );
                  atualizarCampo(i, "preco", isNaN(numero) ? "" : numero);
                }}
                onBlur={() => {
                  if (bloco.preco !== "") {
                    const formatado = Number(bloco.preco).toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      }
                    );
                    atualizarCampo(i, "inputText", formatado);
                  }
                }}
                onFocus={() => {
                  atualizarCampo(i, "inputText", bloco.preco); // volta ao valor numérico ao focar
                }}
                style={{
                  backgroundColor: "#fff9c4",
                  border: "1px solid #ccc",
                  padding: "4px",
                  flex: "1 1 120px",
                  minWidth: "120px",
                }}
              />

              <input
                type="text"
                placeholder="Digite a Entrada"
                value={
                  bloco.inputEntrada !== undefined
                    ? bloco.inputEntrada
                    : bloco.entrada
                    ? Number(bloco.entrada).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    : ""
                }
                onChange={(e) => {
                  const texto = e.target.value;
                  atualizarCampo(i, "inputEntrada", texto);

                  // Remove pontos e troca vírgula por ponto
                  const numero = parseFloat(
                    texto.replace(/\./g, "").replace(",", ".")
                  );
                  atualizarCampo(i, "entrada", isNaN(numero) ? "" : numero);
                }}
                onBlur={() => {
                  if (bloco.entrada !== "") {
                    const formatado = Number(bloco.entrada).toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      }
                    );
                    atualizarCampo(i, "inputEntrada", formatado);
                  }
                }}
                style={{
                  backgroundColor: "#fff9c4",
                  border: "1px solid #ccc",
                  padding: "4px",
                  flex: "1 1 120px",
                  minWidth: "120px",
                }}
              />

              <select
                value={bloco.entradaPercentual}
                onChange={(e) => {
                  const percent = +e.target.value;
                  atualizarCampo(i, "entradaPercentual", percent);
                  const entradaRecalculada = ((preco * percent) / 100).toFixed(
                    2
                  );
                  atualizarCampo(i, "entrada", entradaRecalculada);
                }}
                style={{
                  backgroundColor: "#fff9c4",
                  border: "1px solid #ccc",
                  padding: "4px",
                  width: "110px",
                }}
              >
                <option value={0}>% Entrada</option>
                {[...Array(19)].map((_, j) => {
                  const p = (j + 1) * 5;
                  return (
                    <option key={p} value={p}>
                      {p}%
                    </option>
                  );
                })}
              </select>

              <select
                value={bloco.parcelas}
                onChange={(e) => atualizarCampo(i, "parcelas", +e.target.value)}
                style={{
                  backgroundColor: "#fff9c4",
                  border: "1px solid #ccc",
                  padding: "4px",
                  width: "110px",
                }}
              >
                {Array.from({ length: 25 }, (_, n) => (
                  <option key={n} value={n}>
                    {n}x
                  </option>
                ))}
              </select>

              <input
                type="text"
                readOnly
                value={formatarMoeda(valorParcela)}
                style={{
                  backgroundColor: "#f0f0f0",
                  cursor: "not-allowed",
                  padding: "4px",
                  border: "1px solid #ccc",
                  width: "110px",
                }}
                title="Valor de cada parcela"
              />
            </div>

            <div style={{ marginTop: 10 }}>
              <p>
                <strong>ROB Real:</strong> {(robReal * 100).toFixed(2)}%
              </p>
              <p
                style={{
                  backgroundColor: corClassificacao(classificacao),
                  color: classificacao === "PROIBIDO" ? "#fff" : "#000",
                  padding: 6,
                }}
              >
                <strong>Status do ROB:</strong>{" "}
                <span style={{ fontStyle: "italic", fontWeight: "bold" }}>
                  {classificacao}
                </span>
              </p>
              <p>
                <strong>Comissão Aplicada:</strong>{" "}
                {(comissao * 100).toFixed(1)}%
                <p>
                  <p>
                    <strong>Tipo de Comissão:</strong>{" "}
                    {robReal > 0.5
                      ? "Máxima"
                      : robReal >= 0.45
                      ? "Alta"
                      : robReal >= 0.4
                      ? "Alta"
                      : robReal >= 0.35
                      ? "Reduzida"
                      : robReal >= 0.3
                      ? "Crítica"
                      : robReal >= 0.25
                      ? "Mínima"
                      : "Sem Comissão"}
                  </p>
                </p>
              </p>
              <p>
                <p>
                  <strong>Valor da Comissão:</strong>{" "}
                  {formatarMoeda(valorComissao)}
                </p>
              </p>
              <p>
                <strong>Valor Real da Venda:</strong>{" "}
                {formatarMoeda(totalLinha)}
              </p>
              <div style={{ marginTop: 20 }}>
                <h4>Distribuição do ROB</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={[
                      {
                        faixa: "PERFEITO",
                        valor: robReal >= 0.5 ? 1 : 0,
                      },
                      {
                        faixa: "IDEAL",
                        valor: robReal >= 0.45 && robReal < 0.5 ? 1 : 0,
                      },
                      {
                        faixa: "ACEITÁVEL",
                        valor: robReal >= 0.4 && robReal < 0.45 ? 1 : 0,
                      },
                      {
                        faixa: "INADEQUADO",
                        valor: robReal >= 0.35 && robReal < 0.4 ? 1 : 0,
                      },
                      {
                        faixa: "REVENDEDOR",
                        valor: robReal >= 0.25 && robReal < 0.35 ? 1 : 0,
                      },
                      {
                        faixa: "PROIBIDO",
                        valor: robReal < 0.25 ? 1 : 0,
                      },
                    ]}
                  >
                    <XAxis dataKey="faixa" />
                    <YAxis hide />
                    <Tooltip />
                    <Bar dataKey="valor">
                      {[
                        "#00cc00", // PERFEITO
                        "#00ff7f", // IDEAL
                        "#b3ffcc", // ACEITÁVEL
                        "#ffff99", // INADEQUADO
                        "#ff9999", // REVENDEDOR
                        "#990000", // PROIBIDO
                      ].map((cor, index) => (
                        <Cell key={index} fill={cor} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {blocos.length > 1 && (
              <button
                onClick={() => removerBloco(i)}
                style={{
                  background: "red",
                  color: "#fff",
                  padding: 5,
                  marginTop: 10,
                }}
              >
                Remover Bloco
              </button>
            )}
          </div>
        );
      })}

      <button
        onClick={adicionarBloco}
        style={{ padding: 10, background: "green", color: "#fff" }}
      >
        + Adicionar Novo Produto
      </button>
    </div>
  );
}
