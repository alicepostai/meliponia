# 🐝 Meliponia - Gerenciamento de Abelhas Sem Ferrão

<div align="center">
  <img src="./assets/images/icon.png" alt="Meliponia Logo" width="150" height="150"/>
  
  <p>Sistema completo para gerenciamento e monitoramento de colmeias de abelhas sem ferrão (meliponíneos)</p>

[![React Native](https://img.shields.io/badge/React%20Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

</div>

---

## 📖 Sobre o Projeto

O **Meliponia** é um aplicativo mobile desenvolvido para meliponicultores que desejam gerenciar suas colmeias de abelhas sem ferrão de forma profissional e organizada. O aplicativo oferece ferramentas completas para registro, monitoramento e análise das atividades apícolas.

### 🎯 Objetivos

- **Facilitar** o gerenciamento de colmeias e atividades apícolas
- **Centralizar** informações sobre abelhas sem ferrão brasileiras
- **Otimizar** o controle de produção e saúde das colmeias
- **Promover** práticas sustentáveis na meliponicultura

---

## ✨ Funcionalidades

### 🏠 **Gerenciamento de Colmeias**

- ✅ Cadastro completo de colmeias com 90+ espécies brasileiras
- ✅ Localização GPS integrada com mapas interativos
- ✅ Códigos QR para identificação rápida
- ✅ Histórico detalhado de cada colmeia
- ✅ Status de colmeias (Ativa, Vendida, Doada)

### 📊 **Ações e Monitoramento**

- 🔍 **Revisões**: Registro detalhado do estado da colmeia
- 🍯 **Colheitas**: Controle de mel, pólen e própolis
- 🌸 **Alimentação**: Histórico nutricional das abelhas
- 🔧 **Manejos**: Registros de manutenção e cuidados
- 📦 **Transferências**: Mudanças de caixa e local
- ➗ **Divisões**: Criação de novas colmeias

### 🗺️ **Mapas e Localização**

- 📍 Visualização de colmeias em mapa interativo
- 🎯 Localização automática via GPS
- 📏 Seletor manual de coordenadas
- 🌍 Suporte a múltiplas localizações

### 👤 **Perfil e Configurações**

- 🔐 Sistema de autenticação seguro
- 👤 Gerenciamento de perfil personalizado
- 🌓 Suporte a tema claro/escuro
- 📱 Interface adaptativa

### 🔄 **Modo Offline**

- 💾 Sincronização automática quando online
- 📱 Funcionamento completo sem internet
- ☁️ Backup automático na nuvem
- 🔄 Sincronização inteligente de dados

---

## 🛠️ Tecnologias Utilizadas

### **Frontend Mobile**

- **React Native** 0.76.9 - Framework principal
- **Expo SDK** ~52.0 - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **Expo Router** - Navegação baseada em arquivos

### **Backend e Banco de Dados**

- **Supabase** - Backend como serviço
- **PostgreSQL** - Banco de dados relacional
- **Row Level Security** - Segurança avançada

### **Mapas e Localização**

- **Expo Location** - Serviços de geolocalização
- **React Native Maps** - Mapas interativos
- **GPS** - Coordenadas precisas

### **UI/UX e Mídia**

- **React Native Paper** - Componentes Material Design
- **Vector Icons** - Ícones vetoriais
- **React Native Modal** - Modais avançados
- **Expo Camera** - Scanner de QR Code
- **Image Picker** - Seleção de imagens

### **Formulários e Validação**

- **Formik** - Gerenciamento de formulários
- **Yup** - Validação de esquemas
- **Date/Time Picker** - Seletores de data

### **Estado e Storage**

- **AsyncStorage** - Armazenamento local
- **NetInfo** - Status da conexão
- **Offline Sync** - Sincronização offline

---

## 📋 Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **Git**

### Para desenvolvimento mobile:

- **Android Studio** (para Android)
- **Xcode** (para iOS - apenas macOS)
- **Expo Go** (para testes rápidos)

---

## 🚀 Instalação e Configuração

### 1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/meliponia.git
cd meliponia
```

### 2. **Instale as dependências**

```bash
npm install
# ou
yarn install
```

### 3. **Configure as variáveis de ambiente**

```bash
# Crie um arquivo .env na raiz do projeto
cp .env.example .env

# Configure suas credenciais do Supabase
EXPO_PUBLIC_SUPABASE_URL=sua_url_do_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 4. **Configure o Supabase**

#### 4.1 Configuração básica das tabelas

- Siga o guia detalhado em [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)
- Configure as tabelas e políticas RLS
- Ative a autenticação por email

#### 4.2 Configuração do Storage (IMPORTANTE)

Para que o upload de imagens funcione corretamente, você precisa configurar o Storage:

**Opção 1 - Script automático (recomendado):**

1. Acesse o SQL Editor no painel do Supabase
2. Execute o script [`setup-supabase-storage.sql`](./setup-supabase-storage.sql)

**Opção 2 - Configuração manual:**

1. Siga as instruções detalhadas em [`SUPABASE_STORAGE_SETUP.md`](./SUPABASE_STORAGE_SETUP.md)

⚠️ **Nota importante:** Sem a configuração do Storage, você receberá o erro "Erro no Banco - Ocorreu um erro desconhecido" ao tentar adicionar fotos nas colmeias.

### 5. **Inicie o projeto**

```bash
npm start
# ou
npx expo start
```

---

## 📱 Como Usar

### **Primeiros Passos**

1. **Cadastre-se** ou faça **login** no aplicativo
2. **Cadastre sua primeira colmeia** com espécie e localização
3. **Explore o mapa** para visualizar suas colmeias
4. **Registre ações** como revisões e alimentações

### **Gerenciando Colmeias**

- Use o **scanner QR** para acesso rápido
- **Registre ações** regulares para acompanhamento
- **Monitore a produção** através do histórico
- **Exporte relatórios** quando necessário

### **Modo Offline**

- Todas as ações funcionam **sem internet**
- Os dados são **sincronizados automaticamente**
- **Notificações** informam sobre o status da sincronização

---

## 📂 Estrutura do Projeto

```
📦 meliponia/
├── 📁 app/                     # Rotas do Expo Router
│   ├── 📁 (app)/              # Área autenticada
│   ├── 📁 (auth)/             # Telas de autenticação
│   └── 📄 _layout.tsx         # Layout principal
├── 📁 src/
│   ├── 📁 components/         # Componentes reutilizáveis
│   │   ├── 📁 buttons/        # Botões customizados
│   │   ├── 📁 cards/          # Cards de informação
│   │   ├── 📁 forms/          # Componentes de formulário
│   │   ├── 📁 maps/           # Componentes de mapa
│   │   └── 📁 modals/         # Modais e overlays
│   ├── 📁 constants/          # Constantes e configurações
│   │   ├── 📄 BeeSpeciesList.ts # 90+ espécies brasileiras
│   │   └── 📄 AppConstants.ts  # Configurações gerais
│   ├── 📁 contexts/           # Contextos React
│   ├── 📁 hooks/              # Hooks customizados
│   ├── 📁 screens/            # Telas do aplicativo
│   ├── 📁 services/           # Serviços e APIs
│   ├── 📁 theme/              # Tema e estilos
│   ├── 📁 types/              # Tipos TypeScript
│   └── 📁 utils/              # Utilitários
├── 📁 assets/                 # Recursos estáticos
└── 📄 package.json           # Dependências
```

---

## 🐝 Espécies Suportadas

O aplicativo inclui um catálogo completo com **90+ espécies** de abelhas sem ferrão brasileiras, incluindo:

### **Gêneros Principais**

- **Melipona** (Jandaíra, Uruçu, Mandaçaia, etc.)
- **Scaptotrigona** (Tubuna, Mandaguari, etc.)
- **Tetragonisca** (Jataí)
- **Plebeia** (Mirim, Mosquito, etc.)
- **Trigona** (Arapuá, Boca-de-sapo, etc.)
- **Frieseomelitta** (Marmelada, Moça-branca, etc.)

Cada espécie inclui:

- 📸 **Foto ilustrativa**
- 🔬 **Nome científico**
- 📍 **Distribuição geográfica**
- ℹ️ **Características distintivas**

---

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm start              # Inicia o servidor Expo
npm run android        # Executa no Android
npm run ios           # Executa no iOS
npm run web           # Executa na web

# Qualidade do Código
npm run lint          # Executa o linter
npm test             # Executa os testes
npm run type-check   # Verifica tipos TypeScript

# Build e Deploy
npm run build         # Build para produção
npm run preview       # Preview do build
```

---

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Para contribuir:

### 1. **Fork o projeto**

### 2. **Crie uma branch para sua feature**

```bash
git checkout -b feature/nova-funcionalidade
```

### 3. **Commit suas mudanças**

```bash
git commit -m "feat: adiciona nova funcionalidade"
```

### 4. **Push para a branch**

```bash
git push origin feature/nova-funcionalidade
```

### 5. **Abra um Pull Request**

---

## 📋 Roadmap

### **🔄 Em Desenvolvimento**

- [ ] TODO

### **🎯 Próximas Versões**

- [ ] TODO

### **💡 Ideias Futuras**

- [ ] TODO

---

## 📞 Suporte e Contato

### **🐛 Encontrou um bug?**

- Abra uma [issue no GitHub](https://github.com/seu-usuario/meliponia/issues)
- Descreva o problema detalhadamente
- Inclua screenshots se possível

### **💡 Tem uma sugestão?**

- Use as [Discussions do GitHub](https://github.com/seu-usuario/meliponia/discussions)
- Participe da comunidade de meliponicultores

### **📧 Contato Direto**

- Email: **suporte.meliponia@gmail.com**

---

<div align="center">
  <p>
    Feito com ❤️ para a comunidade de meliponicultores brasileiros
  </p>
  <p>
    <strong>🐝 Preservando as abelhas sem ferrão do Brasil 🇧🇷</strong>
  </p>
</div>
