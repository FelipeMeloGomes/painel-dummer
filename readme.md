# FM Dumer

Este é o repositório do Painel de Controle do FM Dumer, um aplicativo onde os usuários podem acessar e baixar um APK, enquanto administradores gerenciam planos de acesso **(Free e Premium)**.

## ▶️ Executando o projeto

Para rodar o projeto, utilize o seguinte comando:

```sh
npm install
```

```sh
npx expo start
```

Isso abrirá o **Expo Developer Tools**, permitindo rodar o app no simulador/emulador ou em um dispositivo físico através do Expo Go.

## 📱 Tecnologias Utilizadas

- **React Native**
- **React Native Paper**
- **React Hook Form**
- **Zod**
- **Expo**
- **TypeScript**
- **Supabase**

## 🚀 Funcionalidades

O projeto conta com as seguintes funcionalidades:

| 🚀 Funcionalidade                      | ✅ Status       |
| -------------------------------------- | --------------- |
| 📌 Cadastro e login de usuários        | ✅ Implementado |
| 🔑 Autenticação com Supabase           | ✅ Implementado |
| 🎨 UI otimizada com React Native Paper | ✅ Implementado |
| 🔄 Atualização de Role por Admin       | ✅ Implementado |
| 📊 Painel administrativo               | ✅ Implementado |
| 📥 Contagem de downloads por usuário   | ✅ Implementado |
| 🛡️ Sistema de licenças                 | ✅ Implementado |

## 📌 Organização e Boas Práticas

O projeto segue um conjunto de boas práticas para melhorar a organização e manutenção do código:

| 📂 Estrutura e Boas Práticas     | ✅ Descrição                                                                                                                 |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 🎨 **Estilos**                   | Todos os estilos estão organizados em arquivos separados dentro da pasta `styles/`, facilitando a manutenção e reutilização. |
| ⚡ **Hooks**                     | Funções customizadas do React estão organizadas na pasta `hooks/`, promovendo melhor reusabilidade no projeto.               |
| 📜 **Schemas**                   | Esquemas de dados e validações estão na pasta `schemas/`, garantindo consistência nas regras de validação.                   |
| 🔄 **Context API**               | Utilizada para gerenciar estados globais de forma eficiente.                                                                 |
| 🛠️ **Componentes reutilizáveis** | Criados para evitar repetição de código e facilitar a manutenção.                                                            |
| 📏 **Código organizado**         | Estruturado de forma clara, fácil de entender e manter.                                                                      |
| 🏷️ **Nomenclatura clara**        | Uso de nomes descritivos para variáveis e funções, tornando o código mais legível.                                           |
| 📦 **Código modular**            | Divisão em pequenos módulos reutilizáveis para melhor manutenção.                                                            |

---

Desenvolvido por [Felipe Melo](https://github.com/FelipeMeloGomes) 🚀
