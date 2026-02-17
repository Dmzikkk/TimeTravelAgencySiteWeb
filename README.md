# TimeTravel Agency - Webapp Interactive

Webapp interactive pour une agence de voyage temporel fictive, créée avec IA générative.

**URL du site :** https://timetravel-agency-topaz.vercel.app

## Stack Technique
- React 19 + Vite 6
- Lucide React (icônes)
- Groq API + Llama 3.3 70B (chatbot IA)
- Google Fonts (Cormorant Garamond, Outfit)
- Hébergement : Vercel

## Features
- Landing page interactive avec animation de particules
- Hero section avec scroll reveal animations
- Galerie de 3 destinations temporelles (Paris 1889, Crétacé -65M, Florence 1504)
- Cards interactives avec hover effects et modals détaillées
- Chatbot IA conversationnel (Groq API + Llama 3.3)
- Quiz de recommandation personnalisée (4 questions)
- Navigation fluide avec smooth scroll
- Design responsive (mobile + desktop)
- Thème sombre premium avec accents dorés

## IA Utilisées
- Code : Claude (Anthropic)
- Chatbot : Llama 3.3 70B via Groq API
- Visuels : générés par IA (Projet 1 TimeTravel Agency)

## Installation

```bash
npm install
```

Créer un fichier `.env` à la racine :
```
VITE_GROQ_API_KEY=votre_cle_groq
```

Lancer le serveur de développement :
```bash
npm run dev
```

## Déploiement

```bash
npm run build
```

Le site est déployé sur Vercel avec déploiement automatique.

## Crédits
- Groq API (chatbot IA)
- Lucide Icons
- Google Fonts

## Licence
Projet pédagogique — M1/M2 Digital & IA
