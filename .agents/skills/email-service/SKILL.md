---
name: email-service
description: Guia de implementação e documentação de uso do Email Service, cobrindo as variáveis de ambiente VITE_EMAIL_API_URL, VITE_EMAIL_API_KEY e VITE_EMAIL_TO, além das funções de envio de notificações e confirmações de agendamento.
---

# Email Service — Guia de Integração e Uso

Esta Skill fornece a documentação sobre o funcionamento do serviço de e-mail ([`emailService.ts`](file:///Users/leo/Github/rdsesthetique/src/services/emailService.ts))

O serviço conecta-se com um microserviço de envio de e-mails hospedado no DigitalOcean Functions utilizando a API do Resend.

---

## 🔑 Variáveis de Ambiente

O serviço utiliza as seguintes variáveis do Vite (prefixadas com `VITE_`) para sua configuração. Se não definidas, o serviço recorre a valores padrão (*fallback*):

### 1. `VITE_EMAIL_API_URL`
* **Descrição:** A URL do endpoint do microserviço HTTP encarregado de despachar os e-mails.
* **Valor Padrão (Fallback):** `https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-86527741-6118-4953-a5b7-46c827b1a71a/email/send`
* **Exemplo de Configuração `.env`:**
  ```env
  VITE_EMAIL_API_URL=https://sua-url-de-api-digitalocean/email/send
  ```

### 2. `VITE_EMAIL_API_KEY`
* **Descrição:** A chave de API secreta exigida para autenticação com o microserviço. Ela é enviada tanto no cabeçalho `X-API-Key` quanto no corpo da requisição no parâmetro `__header_x_api_key`.
* **Valor Padrão (Fallback):** `935f2c4b-540a-4a70-a3e7-248e898078f7`
* **Exemplo de Configuração `.env`:**
  ```env
  VITE_EMAIL_API_KEY=seu-token-da-api-aqui
  ```

### 3. `VITE_EMAIL_TO`
* **Descrição:** O endereço de e-mail administrativo do salão que receberá as notificações de novas reservas realizadas no site.
* **Valor Padrão (Fallback):** `lemmleoncio@gmail.com`
* **Exemplo de Configuração `.env`:**
  ```env
  VITE_EMAIL_TO=admin@rds-esthetique.ch
  ```

---

## 🛠️ Funções Exportadas

### 1. `sendEmail`
Função de baixo nível para envio de e-mails genéricos.

```typescript
import { sendEmail } from '@/services/emailService';

await sendEmail({
  to: 'cliente@email.com',
  subject: 'Assunto do E-mail',
  html: '<p>Conteúdo HTML</p>',
  replyTo: 'contato@rds-esthetique.ch' // Opcional
});
```

* **Interface de Parâmetros:**
  ```typescript
  export interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
    replyTo?: string;
  }
  ```

---

### 2. `sendAppointmentEmails`
Função orquestradora para fluxos de agendamentos. Quando um agendamento é efetuado, ela realiza duas ações:
1. **Notifica o Administrador (`VITE_EMAIL_TO`):** Envia um e-mail detalhado sobre o cliente e soin agendado. O campo `replyTo` é preenchido com o e-mail do cliente para facilitar a resposta direta.
2. **Confirmação para o Cliente:** Envia um e-mail com visual premium confirmando a recepção da solicitação e os detalhes do agendamento (soin, data, hora, código de confirmação).

```typescript
import { sendAppointmentEmails } from '@/services/emailService';

await sendAppointmentEmails({
  confirmationId: 'RDS-12345',
  fullName: 'Marie Dupont',
  email: 'marie.dupont@example.com',
  phone: '+41 78 123 45 67',
  serviceName: 'Soin Hydrafacial',
  date: '2026-08-10',
  timeSlot: '14:00',
  message: 'Preferência por sala silenciosa' // Opcional
});
```

* **Interface de Dados:**
  ```typescript
  export interface BookingEmailData {
    confirmationId: string;
    fullName: string;
    email: string;
    phone: string;
    serviceName: string;
    date: string;
    timeSlot: string;
    message?: string;
  }
  ```

---

## 📧 Layout e Templates de E-mail

Os e-mails gerados possuem estilização inline baseada na paleta de cores institucional definida nas diretrizes visuais ([`AGENTS.md`](file:///Users/leo/Github/rdsesthetique/agents.md)):
- **Fundo Principal (Cream/Sand):** `#FBF9F5`
- **Texto Principal (Dark Charcoal):** `#2C2825`
- **Destaques e Bordas (Gold/Champagne):** `#B89759` e `#E8DFC9`
- **Tipografia:** Arial e fontes serifadas para cabeçalhos (como Georgia).
