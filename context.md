# Prompt — Landing Page Vórus (Grupo Cacal)

> Copie este prompt inteiro para a sessão onde você vai programar (Claude Code ou similar), com acesso ao MCP do Figma habilitado. Ele foi montado a partir da inspeção real do arquivo via `get_design_context` / `get_metadata` / `get_motion_context`.

## Como iniciar (VS Code)

Cole isto na primeira mensagem para o agente (com o servidor Figma Dev Mode MCP conectado no VS Code):

```
Implement this design from Figma.
@https://www.figma.com/design/gTTOImD6FEb3FB2amaVUv1/Sem-t%C3%ADtulo?node-id=121-129&m=dev
```

Isso já dispara o `get_design_context` no node `121:129` automaticamente. O restante deste documento é o contexto/regras que o agente deve seguir a partir daí — cole tudo abaixo junto na mesma mensagem (ou como instrução de sistema/regra do projeto, se o seu setup no VS Code suportar).

## Fonte de verdade

- Figma file key: `gTTOImD6FEb3FB2amaVUv1`
- Frame raiz: `Vórus — Quem cuida, pede Vórus.` — node `121:129` (1366px de largura de referência, ~8400px de altura)
- URL original: https://www.figma.com/design/gTTOImD6FEb3FB2amaVUv1/Sem-t%C3%ADtulo?node-id=121-129

## Stack de destino

- HTML + CSS + JS vanilla (sem framework, sem build step), seguindo o mesmo padrão já usado no site da Cooptures.
- GSAP para as animações: `ScrollTrigger` para reveals ao entrar na viewport, aproveitando a biblioteca de padrões de animação GSAP já existente no projeto (parallax, clip-path reveals, sticky scroll) em vez de reinventar.
- Sem Tailwind como dependência — o código do MCP vem em Tailwind, mas isso é só referência estrutural; converter para CSS próprio (classes semânticas, BEM ou o padrão que o projeto já usa).

## Regras estruturais (obrigatórias)

1. **Estrutura em divs + flexbox o mais próxima possível da disposição do Figma.** Cada "Container"/"Section" do Figma vira uma div com `display: flex` (a maioria é `flex-direction: column` no nível de seção, `row` nos grupos de cards/colunas — respeitar exatamente o que o MCP retornou por seção, ver mapa abaixo).
2. **Container flexbox com o conteúdo interno medido em % para responsividade.** Nada de larguras fixas em px para os contêineres de conteúdo — os valores em px do Figma (ex: `w-[1320px]`, `w-[560px]`) são a largura de referência no desktop; converter para `max-width` em px + `width: 100%`/`%` internos, não para px fixo.
3. **`clamp()` em todas as fontes.** Cada tamanho de fonte do Figma (ex: `text-[81.96px]` no H1, `text-[60.8px]` nos H2, `text-[16.8px]` no body) deve virar `font-size: clamp(min, preferred, max)`, calculado a partir do valor de referência em 1366px de viewport. Use a fórmula padrão de `clamp` baseada em `vw` entre um mínimo mobile (~360px) e o valor de desktop.
4. Trabalhar **seção por seção**: para cada seção do mapa abaixo, chamar `get_design_context` no node-id específico (não no frame `121:129` inteiro) para ter o código de referência daquela seção com contexto de sobra. O dump da página inteira já foi feito nesta conversa e pode ser reaproveitado, mas para ajustes finos prefira puxar de novo o node específico.

## Mapa de seções (node-id → função)

| #   | Node ID    | Nome no Figma                 | Função                                                                                                               |
| --- | ---------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 1   | `121:131`  | Container (marquee 1)         | Ticker infinito, bg vinho `#5c001a`, frases + estrela dourada, 12 itens duplicados (2x o mesmo conjunto de 6 frases) |
| 2   | `121:182`  | Navigation                    | Header sticky, logo + 5 links + CTA pill                                                                             |
| 3   | `157:3900` | Container (Hero)              | Headline + burst de partículas animado (ver Motion §1)                                                               |
| 4   | `121:219`  | Container (Cuidar vai além)   | Texto + imagem do cão com pop-in (ver Motion §2)                                                                     |
| 5   | `121:236`  | Section (Linha de produtos)   | 3 cards de produto (Premium / Essencial / Essencial Gatos)                                                           |
| 6   | `121:335`  | Container (marquee 2)         | Ticker infinito, bg laranja `#e35f10`                                                                                |
| 7   | `121:370`  | Section (Diferenciais)        | Grid 2×2 de cards ("Por que escolher Vórus?")                                                                        |
| 8   | `121:419`  | Section (Vórus é da Cacal)    | 3 stats grandes (60+, 3, 26%)                                                                                        |
| 9   | `121:462`  | Section (Alimentar bem)       | Texto + foto (gato comendo ração)                                                                                    |
| 10  | `121:475`  | Section (Tribo Vórus)         | Grid 6 fotos + hashtag #EuEscolhiVórus                                                                               |
| 11  | `121:504`  | Section (Para distribuidores) | Ideal para (4 ícones) + Você recebe (3 cards) + banner CTA laranja                                                   |
| 12  | `121:582`  | Section (CTA final)           | 2 botões centrados                                                                                                   |
| 13  | `121:598`  | Footer                        | Logo, contato, navegação, "animaaaalll!" decorativo                                                                  |

## Paleta

```
--cor-creme:        #fdf5e8   (bg principal)
--cor-creme-escuro:  #f9eed4   (bg seções alternadas)
--cor-pill-bg:       #f5e8c8   (fundo de badges/pills)
--cor-vinho:         #5c001a   (texto principal / bg seções escuras)
--cor-marrom-escuro: #3d1505   (bg footer distribuidores, texto nav)
--cor-laranja:       #e35f10   (cor de destaque / CTA)
--cor-laranja-hover: #e46a21
--cor-laranja-escuro:#c94e08
--cor-texto-corpo:   #6b5d52
--cor-dourado:       #d4900a   (estrelas, badges sobre fundo escuro)
```

Gradientes dos cards de produto (linear, ~161deg):

- Premium (cães): `#f2c68c → #e39c4e`
- Essencial (cães): `#7ec3d6 → #3aa0bc`
- Essencial Gatos: `#b7d89d → #6baa48`

## Tipografia

- **Archivo Black** — todos os H1/H2/H3 e números grandes de estatística
- **Barlow Condensed** (Black / ExtraBold / Bold) — labels em uppercase com tracking largo, botões, itens do marquee
- **DM Sans** — todo o corpo de texto (parágrafos). Nota: usa o eixo variável `opsz` (optical size) fixado em 14 — se for usar a variable font, manter `font-variation-settings: "opsz" 14`
- **Pacifico** — só na palavra "Pet." do H1 (script/cursiva)
- **Poppins Black** — só em "RE" do H1 (antes de "Pet.")
- **Neulis:Bold** — ⚠️ só no "ANIMAAALLLLL" da seção 4. Essa fonte não está no Google Fonts — confirmar se já existe o arquivo/licença no projeto (provavelmente sim, se já é usada em outro material da marca); se não houver, substituir por uma fonte display disponível como fallback e avisar no PR.

## Assets — baixar antes de codar

As imagens do Figma ficam em URLs temporárias (expiram em ~7 dias) hospedadas em `figma.com`, que **não é acessível pelo sandbox desta conversa** — os comandos abaixo precisam ser rodados no seu ambiente local (terminal ou dentro da sessão do Claude Code, que tem rede própria).

Crie a pasta `assets/` do projeto e rode:

```bash
mkdir -p assets/img assets/icons

# --- imagens raster (seção Nav/Footer/Hero) ---
curl -L -o assets/img/logo-vorus.png       "https://www.figma.com/api/mcp/asset/25d60721-d622-4493-923c-708ac9124bf4.png"
curl -L -o assets/img/hero-bg.png          "https://www.figma.com/api/mcp/asset/786b0ce6-d768-4b0f-912f-7eec5e976295.png"
curl -L -o assets/img/hero-pet.png         "https://www.figma.com/api/mcp/asset/c60bdcb3-a44e-41c1-aaf2-26af1c2c1be1.png"
curl -L -o assets/img/dog-section.png      "https://www.figma.com/api/mcp/asset/127b29bb-88c2-4f4c-8c31-fa8464802343.png"
curl -L -o assets/img/produto-premium.png  "https://www.figma.com/api/mcp/asset/317dd6a6-5d4b-4ce8-be7e-77d7d0b14cbc.png"
curl -L -o assets/img/produto-essencial.png "https://www.figma.com/api/mcp/asset/465c9fd5-3ec7-4d57-8113-87e659d5522e.png"
curl -L -o assets/img/produto-gatos.png    "https://www.figma.com/api/mcp/asset/130a54a5-882b-4fca-b87d-33f1f150740d.png"
curl -L -o assets/img/diferenciais-bg.png  "https://www.figma.com/api/mcp/asset/600d8d99-29e7-403f-aaab-9e448c881438.png"
curl -L -o assets/img/ilustracao-cachorro.png "https://www.figma.com/api/mcp/asset/ecb9c57b-fe4b-452e-aed5-74c5abc4836d.png"
curl -L -o assets/img/ilustracao-filhote.png  "https://www.figma.com/api/mcp/asset/c831f134-02cc-4be8-99ee-c5dfd2be9562.png"
curl -L -o assets/img/ilustracao-gato.png     "https://www.figma.com/api/mcp/asset/73928c7d-07c5-4895-ac37-00d641edce6b.png"
curl -L -o assets/img/gato-comendo-racao.png  "https://www.figma.com/api/mcp/asset/ad9a6d8a-c28a-4ebf-b0a1-3cf86f9b595e.png"
curl -L -o assets/img/tribo-foto-placeholder.png "https://www.figma.com/api/mcp/asset/4b2e8575-7499-44fa-81e2-a99972933767.png"
curl -L -o assets/img/logo-cacal.png       "https://www.figma.com/api/mcp/asset/0a45293e-075c-4d01-9bd3-a5221c80be72.png"
curl -L -o assets/img/logo-somos-coop.png  "https://www.figma.com/api/mcp/asset/da33c06d-14fb-448a-a780-569319030956.png"

# --- SVGs (ícones dos cards + elementos do burst do hero) ---
curl -L -o assets/icons/icon-formulacao.svg  "https://www.figma.com/api/mcp/asset/05c70119-b989-4fbc-afd6-0ebbeedef109.svg"
curl -L -o assets/icons/icon-pelos.svg       "https://www.figma.com/api/mcp/asset/66fce80b-9efa-4e4a-8a3b-ee95a46edef8.svg"
curl -L -o assets/icons/icon-proteina.svg    "https://www.figma.com/api/mcp/asset/7a975071-3848-4019-9c71-f3fe15f0d47f.svg"
curl -L -o assets/icons/icon-cuidado.svg     "https://www.figma.com/api/mcp/asset/257115db-da49-40ba-b5de-960880b09530.svg"
curl -L -o assets/icons/icon-petshop.svg     "https://www.figma.com/api/mcp/asset/a836f763-410d-4eaf-841b-6836cb14d6c3.svg"
curl -L -o assets/icons/icon-agropecuaria.svg "https://www.figma.com/api/mcp/asset/f1f42114-468b-4f69-b586-a4d40c2bf47c.svg"
curl -L -o assets/icons/icon-veterinaria.svg "https://www.figma.com/api/mcp/asset/0df5fc62-bb11-4d2b-80fa-b9e5a47693bb.svg"
curl -L -o assets/icons/icon-distribuidor.svg "https://www.figma.com/api/mcp/asset/6fcba75b-e8fd-4a8a-865a-adb592e02e88.svg"
curl -L -o assets/icons/icon-telefone.svg    "https://www.figma.com/api/mcp/asset/358ca258-9788-4553-8baa-f2fdddd29c7a.svg"
curl -L -o assets/icons/icon-email.svg       "https://www.figma.com/api/mcp/asset/405fc493-3474-44a1-9a3b-28b5bcd6271f.svg"
curl -L -o assets/icons/icon-site.svg        "https://www.figma.com/api/mcp/asset/3422ec01-44bc-4317-b333-896a308b235f.svg"
curl -L -o assets/icons/icon-instagram.svg   "https://www.figma.com/api/mcp/asset/1efc9990-616d-494c-8e20-c5e31c716dba.svg"
curl -L -o assets/icons/icon-plimper.svg     "https://www.figma.com/api/mcp/asset/cf0361aa-417b-464f-878e-ddd6f7fb994b.svg"

# --- elementos do burst de partículas (hero, ver Motion §1) ---
curl -L -o assets/icons/burst-shadows.svg "https://www.figma.com/api/mcp/asset/35f74dcc-e8ce-45d9-988a-7cf30cac6498.svg"
curl -L -o assets/icons/burst-path.svg    "https://www.figma.com/api/mcp/asset/8759f815-57de-4bd2-b210-be70586ca10e.svg"
curl -L -o assets/icons/burst-particle-1.svg "https://www.figma.com/api/mcp/asset/743a1995-e4fc-469d-952d-cd508e8614d4.svg"
curl -L -o assets/icons/burst-particle-2.svg "https://www.figma.com/api/mcp/asset/65849eee-2ee9-4ceb-8fd1-b9f3542d6d1f.svg"
curl -L -o assets/icons/burst-particle-3.svg "https://www.figma.com/api/mcp/asset/63e4e39c-c73f-4591-b250-ee1a262eb8c8.svg"
curl -L -o assets/icons/burst-particle-4.svg "https://www.figma.com/api/mcp/asset/b021eee2-2f66-439e-9996-cd8c8ff151d1.svg"
curl -L -o assets/icons/burst-particle-5.svg "https://www.figma.com/api/mcp/asset/d0d9edbe-0e33-4fa4-8786-9f0a28147fc6.svg"
curl -L -o assets/icons/burst-particle-6.svg "https://www.figma.com/api/mcp/asset/4a3a8091-82ea-444e-a9eb-b47cb4a7301d.svg"
curl -L -o assets/icons/burst-top.svg     "https://www.figma.com/api/mcp/asset/0d34a0b7-ae05-4d6e-890a-0f529e84cbf2.svg"
curl -L -o assets/icons/hero-illustration-vector.svg "https://www.figma.com/api/mcp/asset/eaaf0a87-4caf-4f07-a681-b6ce369697fc.svg"

echo "Se algum comando der 404/expirado, chamar get_design_context de novo no node-id correspondente para gerar URLs novas."
```

> Nota: alguns nodes de imagem raster que aparecem repetidos no Figma (ex.: o grid da Tribo Vórus usa a mesma imagem 6x como placeholder) — na implementação final, substituir por fotos reais da campanha #EuEscolhiVórus quando a integração com o Instagram da Vórus estiver pronta (ver contexto do projeto Grupo Cacal — a estratégia definida é buscar via API do Instagram, não upload anônimo).

## Motion — GSAP (escopo fechado: 2 animações)

### 1. Burst de partículas do Hero (node raiz `157:3915`, dentro da seção `157:3900`)

No Figma, 6 vetores (tipo "confete/faísca") ficam invisíveis e voam de uma posição deslocada até a posição final, em loop de 2s. É um efeito de "explosão" ao redor da ilustração central do hero.

Dados extraídos (offset inicial de cada partícula, em px, relativo à posição final):

| Partícula | offset X | offset Y | fade-in começa em (% do ciclo) | chega na posição final em |
| --------- | -------- | -------- | ------------------------------ | ------------------------- |
| 1         | 32.08    | 100.98   | 55.9%                          | 67.5%                     |
| 2         | 0.36\*   | 106.16   | 55.9%                          | 67.5%                     |
| 3         | -42.37   | 113.26   | 55.9%                          | 67.5%                     |
| 4         | -51.55   | 76.49    | 55.9%                          | 67.7%                     |
| 5         | -72.92   | 41.19    | 55.9%                          | 68.1%                     |
| 6         | -95.68   | 21.79    | 55.9%                          | 67.4%                     |

_(sinal invertido no Figma original; usar valor absoluto com a orientação correta do eixo)_

**Implementação GSAP recomendada:** não replicar o loop infinito de 2s do Figma (é só o preview) — usar isso como uma animação de entrada em `ScrollTrigger` (`once: true` ou `toggleActions: "play none none none"`) quando o hero entra na viewport, com timeline:

```js
gsap
  .timeline({ scrollTrigger: { trigger: "#hero", start: "top 70%" } })
  .from(
    ".burst-particle",
    {
      opacity: 0,
      x: (i, el) => el.dataset.offsetX,
      y: (i, el) => el.dataset.offsetY,
    },
    0,
  )
  .to(
    ".burst-particle",
    {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.05,
    },
    0.3,
  );
```

Guardar os offsets de cada partícula em `data-offset-x` / `data-offset-y` no HTML (valores da tabela acima).

### 2. Pop-in da imagem do cão (node `146:885`, dentro de `146:883`, seção "Cuidar vai além de alimentar")

No Figma: escala de 0.6 → 1 (com overshoot, easing tipo back/elastic leve) + translateY de +275px → 0, em ciclo de 2s.

**Implementação GSAP:** `ScrollTrigger` disparando **uma única vez** quando a seção entra na viewport (não repetir em loop):

```js
gsap.from(".dog-image", {
  scale: 0.6,
  y: 275,
  duration: 0.9,
  ease: "back.out(1.4)", // aproxima o overshoot do cubic-bezier(0.453,0.667,0.628,1.194) do Figma
  scrollTrigger: {
    trigger: ".dog-image",
    start: "top 75%",
    toggleActions: "play none none none",
  },
});
```

## Marquees (tickers)

As duas faixas de texto em loop (`121:131` e `121:335`) não precisam de GSAP — usar `@keyframes` CSS puro com `translateX` infinito (mais leve e não trava scroll), duplicando o conteúdo 2x no DOM para o loop ficar sem costura, como já veio estruturado no Figma (o MCP já retornou os itens duplicados).

## Hover — Cards de Diferenciais (seção 7, node `121:370`)

⚠️ Este hover **não veio como dado de animação do Figma** — `get_motion_context` não retornou nenhum keyframe pra esses cards (interações de "on hover"/prototype não são expostas pelo MCP, só transições de Smart Animate). O efeito abaixo foi inferido da estrutura em camadas e confirmado com o time: um "lift" que revela o bloco de cor por baixo.

Estrutura de cada card (`Card Proteina` / `Card Cuidado`, nodes `132:175`, `132:154` e as instâncias `136:329`, `136:362`):

- **Underlay**: retângulo laranja `#e35f10`, `border-radius: 28px`, `height: 216px`, mesma largura do card, posicionado no fluxo normal (atrás).
- **Card**: retângulo branco com `backdrop-filter: blur(4px)`, `border-radius: 28px`, `height: 234px`, `drop-shadow: 0px 14px 17px rgba(92,0,26,0.45)`, posicionado `absolute; top:0; left:0` — no repouso cobre o Underlay inteiro.

**Comportamento no hover:** o Card branco sobe (`translateY` negativo), deslocando-se em relação ao Underlay e revelando a faixa laranja por trás/abaixo como uma espécie de sombra colorida. Como é um hover simples de estado (não precisa de scroll trigger nem timeline), implementar em **CSS puro**, sem GSAP:

```css
.card-diferencial {
  position: relative;
}

.card-diferencial .card-underlay {
  position: relative; /* fica no fluxo, atrás do .card-front */
  background: var(--cor-laranja);
  border-radius: 28px;
  height: 216px;
}

.card-diferencial .card-front {
  position: absolute;
  inset: 0;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  box-shadow: 0px 14px 17px rgba(92, 0, 26, 0.45);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.card-diferencial:hover .card-front {
  transform: translateY(-10px);
  box-shadow: 0px 20px 24px rgba(92, 0, 26, 0.5);
}
```

Ajustar o valor de `translateY` (sugestão inicial: `-8px` a `-12px`) e testar visualmente contra o screenshot do Figma — o objetivo é revelar uma faixa fina da cor laranja embaixo do card branco, sem separar demais os dois elementos. Aplicar isso só nos 4 cards de "Por que escolher Vórus?" — os cards de produto (seção 5) **não** têm esse efeito.

## Ordem de trabalho sugerida

1. Rodar os `curl` de download dos assets.
2. Montar o esqueleto HTML com as 13 seções do mapa (semântica: `<header>`, `<nav>`, `<section>` por bloco, `<footer>`).
3. CSS base: variáveis de cor, tipografia com `clamp()`, grid/flex por seção.
4. Responsivo: breakpoints a definir (sugestão: 1200 / 900 / 600px) — ainda não foi fechado com você, ajustar conforme o padrão que o projeto já usa.
5. GSAP: as 2 animações de scroll (burst do hero + pop-in do cão) + marquees em CSS puro + hover dos cards de Diferenciais em CSS puro.
6. Revisar contra o screenshot gerado pelo MCP para o node `121:129` antes de considerar pronto.
