# SyncUp

SyncUp to nowoczesna platforma komunikacyjna zaprojektowana z myślą o współpracy, budowaniu społeczności i płynnej wymianie wiadomości. Dzięki eleganckiemu, responsywnemu interfejsowi i bogatemu zestawowi funkcji, SyncUp zapewnia wszystko, czego potrzebujesz, aby połączyć się z zespołami, społecznościami i przyjaciółmi.

https://syncup.bieda.it/

## 🚀 Funkcje

### Główne funkcje
- **Zarządzanie serwerami**: Tworzenie, dostosowywanie i zarządzanie serwerami z unikalnymi zaproszeniami i ustawieniami
- **Komunikacja w czasie rzeczywistym**: Błyskawiczne wiadomości z możliwością edycji, usuwania i formatowania tekstu
- **Kanały**: Organizacja rozmów za pomocą kanałów tekstowych
- **Profile użytkowników**: Konfigurowalne profile z awatarami, nazwami użytkowników i biogramami
- **System ról i uprawnień**: Szczegółowa kontrola dzięki niestandardowym rolom i uprawnieniom
- **System zaproszeń**: Niestandardowe linki zapraszające do dołączenia do serwerów

### Planowane funkcje
- **Wiadomości bezpośrednie**: Prywatne rozmowy między użytkownikami
- **Połączenia głosowe i wideo**: Komunikacja głosowa i wideo wysokiej jakości
- **Udostępnianie plików**: Obsługa obrazów, dokumentów i mediów
- **Niestandardowe motywy**: Personalizowane ustawienia wyglądu
- **System powiadomień**: Konfigurowalne preferencje powiadomień

## 🛠️ Technologie

SyncUp jest zbudowany z wykorzystaniem nowoczesnego stosu technologicznego:

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes
- **Baza danych**: MySQL z Prisma ORM
- **Uwierzytelnianie**: Clerk
- **Komunikacja w czasie rzeczywistym**: Pusher
- **Przesyłanie plików**: UploadThing
- **Komponenty UI**: Radix UI, Shadcn UI
- **Zarządzanie stanem**: Zustand

## 📋 Struktura projektu

```
/app                    # Katalog aplikacji Next.js
  /(app)                # Główne ścieżki aplikacji
  /(auth)               # Ścieżki uwierzytelniania
  /(main)               # Strona główna / marketingowa
  /api                  # Endpointy API
/components             # Komponenty React
  /chat-page-components # Komponenty interfejsu czatu
  /modals               # Okna dialogowe
  /navigation           # Komponenty nawigacyjne
  /profile              # Komponenty profilu użytkownika
  /server               # Komponenty zarządzania serwerem
  /ui                   # Biblioteka komponentów UI
/hooks                  # Niestandardowe hooki React
/lib                    # Funkcje narzędziowe i współdzielona logika
/prisma                 # Schema bazy danych i migracje
```

## 🔧 Pierwsze kroki

### Wymagania wstępne

- Node.js (v18 lub nowszy)
- Baza danych MySQL
- Konto Clerk do uwierzytelniania
- Konto Pusher do funkcji czasu rzeczywistego
- Konto UploadThing do przesyłania plików

### Instalacja

1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/yourusername/syncup.git
   cd syncup
   ```

2. Zainstaluj zależności:
   ```bash
   npm install
   ```

3. Skonfiguruj zmienne środowiskowe:
   Utwórz plik `.env` w katalogu głównym z następującymi zmiennymi:
   ```
   # Baza danych
   DATABASE_URL="mysql://username:password@host:port/syncup"
   
   # Clerk Auth
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # UploadThing
   UPLOADTHING_SECRET=your_uploadthing_secret
   UPLOADTHING_APP_ID=your_uploadthing_app_id
   
   # Pusher
   NEXT_PUBLIC_PUSHER_APP_KEY=your_pusher_app_key
   PUSHER_APP_ID=your_pusher_app_id
   PUSHER_SECRET=your_pusher_secret
   PUSHER_CLUSTER=your_pusher_cluster
   ```

4. Zainicjuj bazę danych:
   ```bash
   npx prisma migrate dev
   ```

5. Uruchom serwer deweloperski:
   ```bash
   npm run dev
   ```

6. Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce, aby zobaczyć aplikację.

## 🏗️ Architektura projektu

### Schema bazy danych

- **User**: Podstawowy podmiot użytkownika z uwierzytelnianiem Clerk
- **Profile**: Informacje o profilu użytkownika
- **Server**: Serwery komunikacyjne
- **Channel**: Kanały tekstowe w obrębie serwerów
- **Message**: Wiadomości w kanałach lub bezpośrednich rozmowach
- **Role**: Role uprawnień dla członków serwera
- **ServerMembership**: Członkostwo użytkowników w serwerach

### Kluczowe procesy

1. **Uwierzytelnianie**: Wykorzystanie Clerk do bezpiecznej rejestracji i logowania
2. **Tworzenie serwera**: Użytkownicy mogą tworzyć i dostosowywać serwery
3. **Zarządzanie kanałami**: Właściciele serwerów mogą tworzyć kanały i zarządzać nimi
4. **Przesyłanie wiadomości**: Komunikacja w czasie rzeczywistym z Pusher
5. **Zarządzanie rolami**: Tworzenie i przydzielanie ról uprawnień

## 📝 Współpraca

Zachęcamy do współpracy przy projekcie SyncUp! Zapraszamy do zgłaszania problemów lub pull requestów.

1. Wykonaj fork repozytorium
2. Utwórz swoją gałąź funkcji (`git checkout -b feature/amazing-feature`)
3. Zatwierdź swoje zmiany (`git commit -m 'Add some amazing feature'`)
4. Wypchnij do gałęzi (`git push origin feature/amazing-feature`)
5. Otwórz Pull Request

## 📄 Licencja

Ten projekt jest objęty licencją MIT - szczegóły znajdziesz w pliku LICENSE.

## 👥 Współtwórcy

- Sandra Gniewkowska
- Krzysztof Janieszewski
- Michał Itrych

## 🙏 Podziękowania

- [Shadcn UI](https://ui.shadcn.com/) za piękne komponenty interfejsu użytkownika
- [Clerk](https://clerk.dev/) za usługi uwierzytelniania
- [Pusher](https://pusher.com/) za możliwości działania w czasie rzeczywistym
- [UploadThing](https://uploadthing.com/) za przesyłanie plików
- [Tailwind CSS](https://tailwindcss.com/) za stylizację
