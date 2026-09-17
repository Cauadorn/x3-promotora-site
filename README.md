# X3 Promotora — Site institucional

Site da **X3 Promotora** (home + página Seja Parceiro) (crédito consignado, Crédito CLT, cartões, empréstimo pessoal e FGTS), com identidade visual baseada nas artes do Instagram: azul royal + ciano, superfícies de vidro e linguagem tecnológica.

- **Stack:** HTML + CSS + JavaScript (ES Modules) com [Vite](https://vite.dev)
- **Animações:** [GSAP](https://gsap.com) + ScrollTrigger e [Lenis](https://lenis.darkroom.engineering) (rolagem suave)
- **Mapa:** contornos de [@svg-maps/brazil](https://github.com/VictorCazanave/svg-maps/tree/master/packages/brazil)
- **Deploy:** GitHub Pages via GitHub Actions (também funciona na Vercel, Netlify ou qualquer hospedagem estática)

---

## Como rodar

Requisito: **Node.js 20.19+** (recomendado 24, ver `.nvmrc`).

```bash
npm install      # instala dependências
npm run dev      # servidor local com hot reload → http://localhost:5173
npm run build    # gera a versão de produção em /dist
npm run preview  # testa o /dist localmente
```

---

## Estrutura

```
.
├── index.html                  # home (todas as seções)
├── seja-parceiro-x3-promotora/
│   └── index.html              # página Seja Parceiro (cadastro PF/PJ)
├── vite.config.js              # base relativa + entradas das páginas
├── package.json
├── .github/workflows/deploy.yml  # build + publicação no GitHub Pages
└── src/
    ├── main.js                 # entrada da home
    ├── partner.js              # entrada da página Seja Parceiro
    ├── data/
    │   └── presence.js         # ⚙️ estados ativos no mapa, conexões e textos do painel
    ├── js/
    │   ├── utils.js            # helpers ($, $$, reduceMotion, whenVisible…)
    │   ├── smooth-scroll.js    # Lenis + ScrollTrigger
    │   ├── nav.js              # menu, menu mobile, link ativo, esconder ao rolar
    │   ├── intro.js            # preloader, entrada do hero e contadores
    │   ├── scroll-animations.js# reveals e parallax
    │   ├── pointer-effects.js  # spotlight nos cards, botões magnéticos
    │   ├── marquee.js          # faixa de bancos
    │   ├── partner-form.js     # formulário de parceiro: PF/PJ, máscaras, CPF/CNPJ, anexos, envio
    │   ├── dashboard.js        # simulação animada do Full Consig
    │   └── brazil-map.js       # mapa interativo
    ├── styles/
    │   ├── main.css            # importa todos os arquivos na ordem certa
    │   ├── tokens.css          # 🎨 cores, fontes, raios, espaçamentos
    │   ├── base.css            # reset, utilitários, padrão de seção
    │   ├── components.css      # botões, chips, badges, vidro, preloader
    │   ├── layout/             # nav.css, footer.css
    │   ├── sections/           # um arquivo por seção da home (com seus breakpoints)
    │   └── pages/partner.css   # estilos exclusivos da página Seja Parceiro
    └── assets/img/             # fotos, ícones 3D, logo e favicon
```

### Seções (em ordem)

| # | Seção | id | CSS |
|---|-------|----|-----|
| — | Hero + números | `top` | `sections/hero.css` |
| — | Bancos parceiros | — | `sections/banks.css` |
| 01 | Soluções | `solucoes` | `sections/solutions.css` |
| 02 | Plataforma Full Consig | `plataforma` | `sections/platform.css` |
| 03 | Presença (mapa) | `presenca` | `sections/presence.css` |
| 04 | Diferenciais | `diferenciais` | `sections/why.css` |
| — | Crédito CLT | `clt` | `sections/clt.css` |
| 05 | Depoimentos | `depoimentos` | `sections/testimonials.css` |
| 06 | Atendimento | `atendimento` | `sections/support.css` |
| 07 | Blog | `blog` | `sections/blog.css` |
| — | CTA final | `parceiro` | `sections/cta.css` |

---

## Edições comuns

**Estados do mapa** → `src/data/presence.js`
Adicione/remova siglas em `ACTIVE_STATES`. Os contadores "UFs com operação ativa" (hero) e "UFs ativas / Regiões" (painel) se atualizam sozinhos. Se criar um estado novo, inclua também uma linha em `CONNECTIONS`.

**Cores e fontes** → `src/styles/tokens.css`

**Textos, links e bancos** → `index.html`
Links ainda como `#` (a definir): *Área do parceiro*, *Ver avaliações no Google*, *Blog/artigos*, *Políticas*.

**Imagens** → `src/assets/img/`
Substitua mantendo o mesmo nome de arquivo. Fotos em JPG (até ~1920px), ícones em PNG transparente.

**Acessibilidade de movimento** → com "reduzir movimento" ativo no sistema, rolagem suave, parallax e animações em loop são desativados automaticamente.

---

## Página Seja Parceiro — `/seja-parceiro-x3-promotora/`

Todos os botões "Seja parceiro" da home levam para esta página. Estrutura baseada na página de parceiros da CredFranco, com a copy do briefing (seção 5):

| # | Seção | id |
|---|-------|----|
| — | Hero | — |
| 01 | Por que a X3? | `por-que` |
| 02 | Portfólio | `portfolio` |
| 03 | Atendimento é parceria | `atendimento` |
| 04 | Requisitos (CNAEs + certificações) | `requisitos` |
| 05 | Cadastro de parceiro (formulário PF/PJ) | `cadastro` |
| 06 | Onde estamos (mapa) | `presenca` |

Link direto já com Pessoa Jurídica selecionada: `seja-parceiro-x3-promotora/?tipo=pj#cadastro`

### Ativar o envio do formulário
O formulário valida tudo (CPF/CNPJ, telefone, CEP, anexos até 10 MB), mas **só envia quando houver destino**. No `<form id="partnerForm">`, preencha:

```html
<form ... data-endpoint="https://seu-endpoint-aqui">
```

O envio é um `POST` `multipart/form-data` com todos os campos e anexos (serve para Formspree, Getform, n8n, Make, API própria etc.). Depois de configurar, remova o bloco `<div class="todo">` ("A definir pela X3") do HTML.

### Pendências da página (marcadas no layout)
- [ ] Destino dos cadastros (e-mail, CRM ou sistema)
- [ ] Links oficiais de Termos de Uso e Política de Privacidade
- [ ] Link da Área do Parceiro (Portal X3: gestao.x3promotora.app.br)

---

## Link temporário para aprovação (sem hospedar)

Gera um endereço público `https://xxxx.trycloudflare.com` que aponta para o site rodando **neste computador**. Não precisa de conta.

Pré-requisito (uma vez): `winget install Cloudflare.cloudflared`

```bash
# terminal 1 — gera a versão final e serve em http://localhost:4173
npm run build
npm run preview

# terminal 2 — cria o link público
npm run tunnel
```

O link aparece no terminal 2 (linha com `trycloudflare.com`).

> ⚠️ Funciona só enquanto os dois terminais estiverem abertos e o computador ligado. Cada vez que o túnel reinicia, o endereço muda. Para um link fixo, use o GitHub Pages abaixo.

---

## Publicar no GitHub

```bash
git add .
git commit -m "Site X3 Promotora"
git remote add origin https://github.com/<usuario-ou-org>/<repositorio>.git
git push -u origin main
```

### GitHub Pages (automático)
1. No repositório: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. A cada `push` na `main`, o workflow `.github/workflows/deploy.yml` gera o build e publica.
3. O endereço aparece em **Actions** (job *deploy*) e em **Settings → Pages**.

> Enquanto o Pages não estiver habilitado, o job de deploy falha — é esperado.

### Vercel / Netlify
Importe o repositório. Detecta Vite automaticamente: build `npm run build`, pasta `dist`.

### Domínio próprio
Configure em **Settings → Pages → Custom domain** (ou no painel da Vercel/Netlify) e aponte o DNS.

---

## Pendências de conteúdo

- [ ] Logos oficiais dos bancos (hoje em texto) e logo X3 em SVG vetorial
- [ ] Confirmar números do hero: 15+ bancos, 8 linhas, 7 UFs, 108x
- [ ] Confirmar lista de bancos (Banco Master foi retirado — liquidado pelo BC em nov/2025)
- [ ] Validar depoimentos e a frase "a promotora que mais cresce no Brasil"
- [ ] Definir URLs: Área do parceiro, Google Reviews, blog e políticas
- [ ] Tela do Full Consig é ilustrativa — trocar por print real se desejado

---

## Créditos

- Mapa do Brasil: [@svg-maps/brazil](https://www.npmjs.com/package/@svg-maps/brazil) — licença CC BY 4.0
- Fotos e ícones 3D: gerados com IA (HiggsField) para uso neste projeto
- Desenvolvimento: 4 Dimensões

© X3 Promotora. Todos os direitos reservados.
