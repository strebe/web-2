# Minimercado Web — Ajuda

Bem-vindo ao sistema web do Minimercado!

## Funcionalidades

Esta [página web](https://strebe.github.io/web-2/) é um sistema básico de minimercado, permitindo a navegação entre diferentes seções através do menu superior. O conteúdo de cada aba é exibido na área central da página, sem recarregar o cabeçalho ou o rodapé.

### Abas disponíveis

- **Sobre**  
  Apresenta uma descrição do minimercado, seus valores e o compromisso com o cliente.

- **Produtos**  
  Exibe as principais categorias de produtos do minimercado:
    - **Açougue:**;
    - **Hortifruti:**;
    - **Mercearia:**;
  Cada produto é apresentado com nome, descrição, valor e espaço reservado para imagem.

- **Serviços**  
  Lista os principais serviços oferecidos:
    - **Entrega:** Informações sobre o serviço de entrega e valores.
    - **Telefone para consulta de preços:** Horário de atendimento e gratuidade do serviço.
 
- **Cadastro de Cliente**  
  Formulário completo para registro de novos clientes:
  - **Dados Pessoais:** Nome, sobrenome, CPF, data de nascimento
  - **Contato:** Telefone com máscara, e-mail com validação
  - **Endereço Completo:** CEP, logradouro, número, complemento, bairro, cidade, UF

- **Agendamento de Serviços**  
  Sistema avançado de agendamento:
  - **Seleção do tipo de serviço** (Entrega ou Retirada)
  - **Calendário interativo** com navegação por mês
  - **Seleção de horários** disponíveis (8h às 18h)
  - **Endereço de entrega condicional** (apenas para entregas)
  - **Campo de observações** para instruções especiais

---

**Observações técnicas:**
- **Roteamento SPA:** Sistema de navegação client-side com histórico do browser
- **Validação de Formulários:** Máscaras automáticas (CPF, telefone, CEP) e validação em tempo real
- **Fallback Inteligente:** Funciona via HTTP (servidor) e file:// (local) com diferentes experiências
- **Modularidade:** Código organizado em handlers específicos por funcionalidade
- **Bootstrap Components:** Carrosséis, modais, cards e componentes interativos
- **Carregamento Otimizado:** Indicadores visuais e feedback imediato
- **Animações:** Hover effects, transições e elementos interativos
- **Acessibilidade:** Aria labels, skip links e navegação por teclado
