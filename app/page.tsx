"use client"

import React, { useState, useRef, createContext, useContext } from "react"
import AdCreator from "./components/AdCreator"
import { 
  Sparkles, 
  LayoutDashboard, 
  Users, 
  Settings, 
  TrendingUp,
  Plus,
  ArrowRight,
  ChevronRight,
  Zap,
  Target,
  BarChart3,
  Bell
} from "lucide-react"

// Language types and translations
type Language = "en" | "es" | "fr" | "de" | "pt"

const translations = {
  en: {
    // Navigation
    home: "Home",
    campaigns: "Campaigns",
    create: "Create",
    analytics: "Analytics",
    settings: "Settings",
    
    // Dashboard
    activeCampaigns: "Active Campaigns",
    totalReach: "Total Reach",
    conversions: "Conversions",
    engagement: "Engagement",
    quickActions: "Quick Actions",
    createWithAI: "Create with AI",
    generateAdsDesc: "Generate stunning ads in seconds",
    launchCampaign: "Launch Campaign",
    deployPlatforms: "Deploy to multiple platforms",
    
    // Create view
    howCanIHelp: "How can I help you",
    thisAfternoon: "this afternoon",
    thisEvening: "this evening",
    thisMorning: "this morning",
    createAdFor: "Create an ad for...",
    photoLibrary: "Photo Library",
    cameraRoll: "Choose from camera roll",
    takePhoto: "Take Photo",
    useCamera: "Use your camera",
    browseFiles: "Browse Files",
    chooseFromFolders: "Choose from folders",
    
    // Campaigns
    yourAds: "Your Ads",
    campaignsCount: "campaigns",
    allAds: "All Ads",
    active: "Active",
    paused: "Paused",
    drafts: "Drafts",
    spend: "Spend",
    addNewAd: "Add New Ad",
    generateHighConverting: "Generate high-converting ads instantly",
    uploadYourOwn: "Upload Your Own",
    addExistingAssets: "Add existing creative assets",
    
    // Upload modal
    uploadCreative: "Upload Creative",
    adDetails: "Ad Details",
    dragDropFiles: "Drag & drop files",
    tapToBrowse: "or tap to browse from your device",
    adName: "Ad Name",
    adNamePlaceholder: "e.g., Summer Sale Campaign",
    platform: "Platform",
    continue: "Continue",
    back: "Back",
    addAd: "Add Ad",
    uploaded: "Uploaded",
    
    // Settings
    editProfile: "Edit Profile",
    changePassword: "Change Password",
    email: "Email",
    phoneNumber: "Phone Number",
    add: "Add",
    account: "Account",
    billingPlan: "Billing & Plan",
    paymentMethods: "Payment Methods",
    subscription: "Subscription",
    billingHistory: "Billing History",
    notifications: "Notifications",
    pushNotifications: "Push Notifications",
    receiveAlerts: "Receive alerts on your device",
    emailNotifications: "Email Notifications",
    campaignUpdates: "Campaign updates and reports",
    preferences: "Preferences",
    darkMode: "Dark Mode",
    switchDarkTheme: "Switch to dark theme",
    language: "Language",
    timezone: "Timezone",
    connectedAccounts: "Connected Accounts",
    connected: "Connected",
    connect: "Connect",
    support: "Support",
    helpCenter: "Help Center",
    contactSupport: "Contact Support",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    accountActions: "Account Actions",
    logOut: "Log Out",
    deleteAccount: "Delete Account",
    
    // Modals
    logOutQuestion: "Log Out?",
    logOutConfirm: "Are you sure you want to log out of your account?",
    cancel: "Cancel",
    deleteAccountQuestion: "Delete Account?",
    cannotBeUndone: "cannot be undone",
    deleteWarning: "All your data, campaigns, and settings will be permanently deleted.",
    typeDelete: "Type",
    toConfirm: "to confirm:",
    typeDeleteHere: "Type 'delete' here",
    
    // Welcome
    welcomeDesc: "Create stunning ads powered by AI. Launch campaigns across all platforms in seconds.",
    getStarted: "Get Started",
    haveAccount: "I already have an account",
    termsAgree: "By continuing, you agree to our Terms of Service and Privacy Policy",
    
    // Navigation — Ad Creator
    adCreator: "Ad Creator",

    // Ad creation language
    adLanguage: "Ad Language",
    selectAdLanguage: "Select the language for your ad content",
  },
  es: {
    // Navigation
    home: "Inicio",
    campaigns: "Campañas",
    create: "Crear",
    analytics: "Analíticas",
    settings: "Ajustes",
    
    // Dashboard
    activeCampaigns: "Campañas Activas",
    totalReach: "Alcance Total",
    conversions: "Conversiones",
    engagement: "Interacción",
    quickActions: "Acciones Rápidas",
    createWithAI: "Crear con IA",
    generateAdsDesc: "Genera anuncios increíbles en segundos",
    launchCampaign: "Lanzar Campaña",
    deployPlatforms: "Despliega en múltiples plataformas",
    
    // Create view
    howCanIHelp: "¿Cómo puedo ayudarte",
    thisAfternoon: "esta tarde",
    thisEvening: "esta noche",
    thisMorning: "esta mañana",
    createAdFor: "Crear un anuncio para...",
    photoLibrary: "Biblioteca de Fotos",
    cameraRoll: "Elegir del carrete",
    takePhoto: "Tomar Foto",
    useCamera: "Usar tu cámara",
    browseFiles: "Explorar Archivos",
    chooseFromFolders: "Elegir de carpetas",
    
    // Campaigns
    yourAds: "Tus Anuncios",
    campaignsCount: "campañas",
    allAds: "Todos",
    active: "Activos",
    paused: "Pausados",
    drafts: "Borradores",
    spend: "Gasto",
    addNewAd: "Agregar Anuncio",
    generateHighConverting: "Genera anuncios de alta conversión al instante",
    uploadYourOwn: "Subir el Tuyo",
    addExistingAssets: "Agregar recursos creativos existentes",
    
    // Upload modal
    uploadCreative: "Subir Creativo",
    adDetails: "Detalles del Anuncio",
    dragDropFiles: "Arrastra y suelta archivos",
    tapToBrowse: "o toca para buscar en tu dispositivo",
    adName: "Nombre del Anuncio",
    adNamePlaceholder: "ej., Campaña de Verano",
    platform: "Plataforma",
    continue: "Continuar",
    back: "Atrás",
    addAd: "Agregar Anuncio",
    uploaded: "Subidos",
    
    // Settings
    editProfile: "Editar Perfil",
    changePassword: "Cambiar Contraseña",
    email: "Correo",
    phoneNumber: "Número de Teléfono",
    add: "Agregar",
    account: "Cuenta",
    billingPlan: "Facturación y Plan",
    paymentMethods: "Métodos de Pago",
    subscription: "Suscripción",
    billingHistory: "Historial de Facturación",
    notifications: "Notificaciones",
    pushNotifications: "Notificaciones Push",
    receiveAlerts: "Recibe alertas en tu dispositivo",
    emailNotifications: "Notificaciones por Correo",
    campaignUpdates: "Actualizaciones y reportes de campañas",
    preferences: "Preferencias",
    darkMode: "Modo Oscuro",
    switchDarkTheme: "Cambiar a tema oscuro",
    language: "Idioma",
    timezone: "Zona Horaria",
    connectedAccounts: "Cuentas Conectadas",
    connected: "Conectado",
    connect: "Conectar",
    support: "Soporte",
    helpCenter: "Centro de Ayuda",
    contactSupport: "Contactar Soporte",
    termsOfService: "Términos de Servicio",
    privacyPolicy: "Política de Privacidad",
    accountActions: "Acciones de Cuenta",
    logOut: "Cerrar Sesión",
    deleteAccount: "Eliminar Cuenta",
    
    // Modals
    logOutQuestion: "¿Cerrar Sesión?",
    logOutConfirm: "¿Estás seguro de que quieres cerrar sesión?",
    cancel: "Cancelar",
    deleteAccountQuestion: "¿Eliminar Cuenta?",
    cannotBeUndone: "no se puede deshacer",
    deleteWarning: "Todos tus datos, campañas y configuraciones serán eliminados permanentemente.",
    typeDelete: "Escribe",
    toConfirm: "para confirmar:",
    typeDeleteHere: "Escribe 'eliminar' aquí",
    
    // Welcome
    welcomeDesc: "Crea anuncios increíbles con IA. Lanza campañas en todas las plataformas en segundos.",
    getStarted: "Comenzar",
    haveAccount: "Ya tengo una cuenta",
    termsAgree: "Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad",
    
    // Navigation — Ad Creator
    adCreator: "Crear Anuncio",

    // Ad creation language
    adLanguage: "Idioma del Anuncio",
    selectAdLanguage: "Selecciona el idioma para tu contenido publicitario",
  },
  fr: {
    home: "Accueil",
    campaigns: "Campagnes",
    create: "Créer",
    analytics: "Analytique",
    settings: "Paramètres",
    activeCampaigns: "Campagnes Actives",
    totalReach: "Portée Totale",
    conversions: "Conversions",
    engagement: "Engagement",
    quickActions: "Actions Rapides",
    createWithAI: "Créer avec IA",
    generateAdsDesc: "Générez des publicités en quelques secondes",
    launchCampaign: "Lancer Campagne",
    deployPlatforms: "Déployer sur plusieurs plateformes",
    howCanIHelp: "Comment puis-je vous aider",
    thisAfternoon: "cet après-midi",
    thisEvening: "ce soir",
    thisMorning: "ce matin",
    createAdFor: "Créer une pub pour...",
    photoLibrary: "Photothèque",
    cameraRoll: "Choisir dans la galerie",
    takePhoto: "Prendre Photo",
    useCamera: "Utiliser la caméra",
    browseFiles: "Parcourir Fichiers",
    chooseFromFolders: "Choisir dans les dossiers",
    yourAds: "Vos Publicités",
    campaignsCount: "campagnes",
    allAds: "Toutes",
    active: "Actives",
    paused: "En Pause",
    drafts: "Brouillons",
    spend: "Dépenses",
    addNewAd: "Ajouter Publicité",
    generateHighConverting: "Générez des publicités performantes instantanément",
    uploadYourOwn: "Télécharger le Vôtre",
    addExistingAssets: "Ajouter des ressources existantes",
    uploadCreative: "Télécharger Créatif",
    adDetails: "Détails de la Pub",
    dragDropFiles: "Glissez-déposez les fichiers",
    tapToBrowse: "ou appuyez pour parcourir",
    adName: "Nom de la Pub",
    adNamePlaceholder: "ex., Campagne d'Été",
    platform: "Plateforme",
    continue: "Continuer",
    back: "Retour",
    addAd: "Ajouter Pub",
    uploaded: "Téléchargés",
    editProfile: "Modifier Profil",
    changePassword: "Changer Mot de Passe",
    email: "Email",
    phoneNumber: "Téléphone",
    add: "Ajouter",
    account: "Compte",
    billingPlan: "Facturation et Plan",
    paymentMethods: "Moyens de Paiement",
    subscription: "Abonnement",
    billingHistory: "Historique",
    notifications: "Notifications",
    pushNotifications: "Notifications Push",
    receiveAlerts: "Recevoir des alertes",
    emailNotifications: "Notifications Email",
    campaignUpdates: "Mises à jour des campagnes",
    preferences: "Préférences",
    darkMode: "Mode Sombre",
    switchDarkTheme: "Passer au thème sombre",
    language: "Langue",
    timezone: "Fuseau Horaire",
    connectedAccounts: "Comptes Connectés",
    connected: "Connecté",
    connect: "Connecter",
    support: "Support",
    helpCenter: "Centre d'Aide",
    contactSupport: "Contacter Support",
    termsOfService: "Conditions d'Utilisation",
    privacyPolicy: "Politique de Confidentialité",
    accountActions: "Actions du Compte",
    logOut: "Déconnexion",
    deleteAccount: "Supprimer Compte",
    logOutQuestion: "Déconnexion?",
    logOutConfirm: "Êtes-vous sûr de vouloir vous déconnecter?",
    cancel: "Annuler",
    deleteAccountQuestion: "Supprimer le Compte?",
    cannotBeUndone: "ne peut pas être annulé",
    deleteWarning: "Toutes vos données seront supprimées définitivement.",
    typeDelete: "Tapez",
    toConfirm: "pour confirmer:",
    typeDeleteHere: "Tapez 'supprimer' ici",
    welcomeDesc: "Créez des publicités avec l'IA. Lancez des campagnes en quelques secondes.",
    getStarted: "Commencer",
    haveAccount: "J'ai déjà un compte",
    termsAgree: "En continuant, vous acceptez nos Conditions d'Utilisation",
    adCreator: "Créer Pub",
    adLanguage: "Langue de la Pub",
    selectAdLanguage: "Sélectionnez la langue du contenu",
  },
  de: {
    home: "Start",
    campaigns: "Kampagnen",
    create: "Erstellen",
    analytics: "Analytik",
    settings: "Einstellungen",
    activeCampaigns: "Aktive Kampagnen",
    totalReach: "Gesamtreichweite",
    conversions: "Konversionen",
    engagement: "Engagement",
    quickActions: "Schnellaktionen",
    createWithAI: "Mit KI erstellen",
    generateAdsDesc: "Erstelle Anzeigen in Sekunden",
    launchCampaign: "Kampagne starten",
    deployPlatforms: "Auf mehreren Plattformen",
    howCanIHelp: "Wie kann ich helfen",
    thisAfternoon: "heute Nachmittag",
    thisEvening: "heute Abend",
    thisMorning: "heute Morgen",
    createAdFor: "Anzeige erstellen für...",
    photoLibrary: "Fotobibliothek",
    cameraRoll: "Aus Galerie wählen",
    takePhoto: "Foto aufnehmen",
    useCamera: "Kamera verwenden",
    browseFiles: "Dateien durchsuchen",
    chooseFromFolders: "Aus Ordnern wählen",
    yourAds: "Ihre Anzeigen",
    campaignsCount: "Kampagnen",
    allAds: "Alle",
    active: "Aktiv",
    paused: "Pausiert",
    drafts: "Entwürfe",
    spend: "Ausgaben",
    addNewAd: "Anzeige hinzufügen",
    generateHighConverting: "Hochkonvertierende Anzeigen erstellen",
    uploadYourOwn: "Eigene hochladen",
    addExistingAssets: "Vorhandene Assets hinzufügen",
    uploadCreative: "Creative hochladen",
    adDetails: "Anzeigendetails",
    dragDropFiles: "Dateien hierher ziehen",
    tapToBrowse: "oder tippen zum Durchsuchen",
    adName: "Anzeigenname",
    adNamePlaceholder: "z.B. Sommerkampagne",
    platform: "Plattform",
    continue: "Weiter",
    back: "Zurück",
    addAd: "Anzeige hinzufügen",
    uploaded: "Hochgeladen",
    editProfile: "Profil bearbeiten",
    changePassword: "Passwort ändern",
    email: "E-Mail",
    phoneNumber: "Telefonnummer",
    add: "Hinzufügen",
    account: "Konto",
    billingPlan: "Abrechnung & Plan",
    paymentMethods: "Zahlungsmethoden",
    subscription: "Abonnement",
    billingHistory: "Rechnungsverlauf",
    notifications: "Benachrichtigungen",
    pushNotifications: "Push-Benachrichtigungen",
    receiveAlerts: "Benachrichtigungen erhalten",
    emailNotifications: "E-Mail-Benachrichtigungen",
    campaignUpdates: "Kampagnen-Updates",
    preferences: "Einstellungen",
    darkMode: "Dunkelmodus",
    switchDarkTheme: "Zum dunklen Design wechseln",
    language: "Sprache",
    timezone: "Zeitzone",
    connectedAccounts: "Verbundene Konten",
    connected: "Verbunden",
    connect: "Verbinden",
    support: "Support",
    helpCenter: "Hilfezentrum",
    contactSupport: "Support kontaktieren",
    termsOfService: "Nutzungsbedingungen",
    privacyPolicy: "Datenschutz",
    accountActions: "Kontoaktionen",
    logOut: "Abmelden",
    deleteAccount: "Konto löschen",
    logOutQuestion: "Abmelden?",
    logOutConfirm: "Möchten Sie sich wirklich abmelden?",
    cancel: "Abbrechen",
    deleteAccountQuestion: "Konto löschen?",
    cannotBeUndone: "kann nicht rückgängig gemacht werden",
    deleteWarning: "Alle Ihre Daten werden dauerhaft gelöscht.",
    typeDelete: "Geben Sie",
    toConfirm: "zur Bestätigung ein:",
    typeDeleteHere: "Hier 'löschen' eingeben",
    welcomeDesc: "Erstellen Sie Anzeigen mit KI. Starten Sie Kampagnen in Sekunden.",
    getStarted: "Loslegen",
    haveAccount: "Ich habe bereits ein Konto",
    termsAgree: "Mit dem Fortfahren akzeptieren Sie unsere Nutzungsbedingungen",
    adCreator: "Anzeige Erstellen",
    adLanguage: "Anzeigensprache",
    selectAdLanguage: "Sprache für Anzeigeninhalt wählen",
  },
  pt: {
    home: "Início",
    campaigns: "Campanhas",
    create: "Criar",
    analytics: "Análises",
    settings: "Configurações",
    activeCampaigns: "Campanhas Ativas",
    totalReach: "Alcance Total",
    conversions: "Conversões",
    engagement: "Engajamento",
    quickActions: "Ações Rápidas",
    createWithAI: "Criar com IA",
    generateAdsDesc: "Gere anúncios incríveis em segundos",
    launchCampaign: "Lançar Campanha",
    deployPlatforms: "Implante em múltiplas plataformas",
    howCanIHelp: "Como posso ajudar",
    thisAfternoon: "esta tarde",
    thisEvening: "esta noite",
    thisMorning: "esta manhã",
    createAdFor: "Criar anúncio para...",
    photoLibrary: "Biblioteca de Fotos",
    cameraRoll: "Escolher do rolo",
    takePhoto: "Tirar Foto",
    useCamera: "Usar câmera",
    browseFiles: "Procurar Arquivos",
    chooseFromFolders: "Escolher de pastas",
    yourAds: "Seus Anúncios",
    campaignsCount: "campanhas",
    allAds: "Todos",
    active: "Ativos",
    paused: "Pausados",
    drafts: "Rascunhos",
    spend: "Gasto",
    addNewAd: "Adicionar Anúncio",
    generateHighConverting: "Gere anúncios de alta conversão instantaneamente",
    uploadYourOwn: "Enviar o Seu",
    addExistingAssets: "Adicionar recursos existentes",
    uploadCreative: "Enviar Criativo",
    adDetails: "Detalhes do Anúncio",
    dragDropFiles: "Arraste e solte arquivos",
    tapToBrowse: "ou toque para procurar",
    adName: "Nome do Anúncio",
    adNamePlaceholder: "ex., Campanha de Verão",
    platform: "Plataforma",
    continue: "Continuar",
    back: "Voltar",
    addAd: "Adicionar Anúncio",
    uploaded: "Enviados",
    editProfile: "Editar Perfil",
    changePassword: "Alterar Senha",
    email: "Email",
    phoneNumber: "Telefone",
    add: "Adicionar",
    account: "Conta",
    billingPlan: "Faturamento e Plano",
    paymentMethods: "Métodos de Pagamento",
    subscription: "Assinatura",
    billingHistory: "Histórico",
    notifications: "Notificações",
    pushNotifications: "Notificações Push",
    receiveAlerts: "Receber alertas",
    emailNotifications: "Notificações por Email",
    campaignUpdates: "Atualizações de campanhas",
    preferences: "Preferências",
    darkMode: "Modo Escuro",
    switchDarkTheme: "Mudar para tema escuro",
    language: "Idioma",
    timezone: "Fuso Horário",
    connectedAccounts: "Contas Conectadas",
    connected: "Conectado",
    connect: "Conectar",
    support: "Suporte",
    helpCenter: "Central de Ajuda",
    contactSupport: "Contatar Suporte",
    termsOfService: "Termos de Serviço",
    privacyPolicy: "Política de Privacidade",
    accountActions: "Ações da Conta",
    logOut: "Sair",
    deleteAccount: "Excluir Conta",
    logOutQuestion: "Sair?",
    logOutConfirm: "Tem certeza que deseja sair?",
    cancel: "Cancelar",
    deleteAccountQuestion: "Excluir Conta?",
    cannotBeUndone: "não pode ser desfeito",
    deleteWarning: "Todos os seus dados serão excluídos permanentemente.",
    typeDelete: "Digite",
    toConfirm: "para confirmar:",
    typeDeleteHere: "Digite 'excluir' aqui",
    welcomeDesc: "Crie anúncios com IA. Lance campanhas em segundos.",
    getStarted: "Começar",
    haveAccount: "Já tenho uma conta",
    termsAgree: "Ao continuar, você concorda com nossos Termos de Serviço",
    adCreator: "Criar Anúncio",
    adLanguage: "Idioma do Anúncio",
    selectAdLanguage: "Selecione o idioma do conteúdo",
  }
}

const languageNames: Record<Language, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  pt: "Português"
}

// Delete confirmation words per language
const deleteWords: Record<Language, string> = {
  en: "delete",
  es: "eliminar",
  fr: "supprimer",
  de: "löschen",
  pt: "excluir"
}

// Language context
type TranslationKeys = keyof typeof translations.en
const LanguageContext = createContext<{
  language: Language
  t: (key: TranslationKeys) => string
  setLanguage: (lang: Language) => void
  adLanguage: Language
  setAdLanguage: (lang: Language) => void
}>({
  language: "en",
  t: (key) => translations.en[key],
  setLanguage: () => {},
  adLanguage: "en",
  setAdLanguage: () => {}
})

const useLanguage = () => useContext(LanguageContext)

// FlareLogo component
function FlareLogo({ size = 56, showWordmark = true }: { size?: number; showWordmark?: boolean }) {
  const arc = size
  const cx = arc / 2
  const cy = arc / 2
  const r1 = arc * 0.16
  const r2 = arc * 0.30
  const r3 = arc * 0.44
  const strokeW = arc * 0.08

  function arcPath(r: number) {
    const startX = cx
    const startY = cy + r
    const endX = cx + r
    const endY = cy
    return `M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`
  }

  return (
    <div className="flex flex-col items-center gap-0">
      <svg
        width={arc}
        height={arc}
        viewBox={`0 0 ${arc} ${arc}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Flare logo"
      >
        <circle cx={cx} cy={cy} r={strokeW * 0.7} fill="#9B7EC8" />
        <path d={arcPath(r1)} stroke="#9B7EC8" strokeWidth={strokeW} strokeLinecap="round" />
        <path d={arcPath(r2)} stroke="#9B7EC8" strokeWidth={strokeW} strokeLinecap="round" opacity="0.75" />
        <path d={arcPath(r3)} stroke="#9B7EC8" strokeWidth={strokeW} strokeLinecap="round" opacity="0.45" />
      </svg>
      {showWordmark && (
        <span
          className="text-[#2C2420] font-black tracking-[0.18em] uppercase"
          style={{ fontSize: size * 0.32, letterSpacing: "0.18em" }}
        >
          FLARE
        </span>
      )}
    </div>
  )
}

// Stat card component
function StatCard({ 
  label, 
  value, 
  change, 
  icon: Icon 
}: { 
  label: string
  value: string
  change: string
  icon: React.ComponentType<{ size?: string | number; className?: string }>
}) {
  const isPositive = change.startsWith("+")
  
  return (
    <div className="bg-white rounded-2xl p-4 border border-[#e8e2da] shadow-sm hover:-translate-y-0.5 transition-transform">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-[#f5f0e8] flex items-center justify-center">
          <Icon size={20} className="text-[#9B7EC8]" />
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          isPositive ? "bg-[#5C9A6E]/10 text-[#5C9A6E]" : "bg-[#B85C5C]/10 text-[#B85C5C]"
        }`}>
          {change}
        </span>
      </div>
      <p className="text-2xl font-bold text-[#2C2420] mb-1">{value}</p>
      <p className="text-sm text-[#6B5D54]">{label}</p>
    </div>
  )
}

// Quick action card
function QuickActionCard({ 
  title, 
  description, 
  icon: Icon,
  onClick
}: { 
  title: string
  description: string
  icon: React.ComponentType<{ size?: string | number; className?: string }>
  onClick?: () => void
}) {
  return (
    <button 
      onClick={onClick}
      className="w-full bg-white rounded-2xl p-4 border border-[#e8e2da] shadow-sm text-left group hover:scale-[1.02] active:scale-[0.98] transition-transform"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9B7EC8] to-[#8A6DB8] flex items-center justify-center">
          <Icon size={24} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#2C2420]">{title}</p>
          <p className="text-sm text-[#6B5D54] truncate">{description}</p>
        </div>
        <ChevronRight size={20} className="text-[#9C8D84] group-hover:text-[#9B7EC8] transition-colors" />
      </div>
    </button>
  )
}

// Recent ad card
function RecentAdCard({ 
  title, 
  platform, 
  status, 
  impressions 
}: { 
  title: string
  platform: string
  status: "active" | "paused" | "draft"
  impressions: string
}) {
  const statusColors = {
    active: "bg-[#5C9A6E]/10 text-[#5C9A6E]",
    paused: "bg-[#B8924A]/10 text-[#B8924A]",
    draft: "bg-[#9C8D84]/10 text-[#9C8D84]"
  }

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#e8e2da] shadow-sm hover:-translate-y-0.5 transition-transform">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusColors[status]}`}>
          {status}
        </span>
        <span className="text-xs text-[#6B5D54]">{platform}</span>
      </div>
      <p className="font-semibold text-[#2C2420] mb-2 line-clamp-2">{title}</p>
      <div className="flex items-center gap-1 text-sm text-[#6B5D54]">
        <TrendingUp size={14} />
        <span>{impressions} impressions</span>
      </div>
    </div>
  )
}

// Bottom tab bar
function BottomTabBar({ activeTab, onTabChange, darkMode = false }: { activeTab: string; onTabChange: (tab: string) => void; darkMode?: boolean }) {
  const { t } = useLanguage()
  const tabs = [
    { id: "home", labelKey: "home" as const, icon: LayoutDashboard },
    { id: "campaigns", labelKey: "campaigns" as const, icon: Target },
    { id: "create", labelKey: "create" as const, icon: Plus, primary: true },
    { id: "analytics", labelKey: "analytics" as const, icon: BarChart3 },
    { id: "settings", labelKey: "settings" as const, icon: Settings },
  ]

  return (
    <div className={`fixed bottom-0 left-0 right-0 border-t pb-safe transition-colors duration-300 ${
      darkMode ? "bg-[#1a1a1a] border-[#2a2a2a]" : "bg-white border-[#e8e2da]"
    }`}>
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon

          if (tab.primary) {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="w-14 h-14 -mt-4 rounded-full bg-gradient-to-br from-[#9B7EC8] to-[#8A6DB8] flex items-center justify-center shadow-lg shadow-[#9B7EC8]/30 active:scale-90 transition-transform"
              >
                <Icon size={24} className="text-white" />
              </button>
            )
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-1 py-2 px-3 active:scale-95 transition-transform"
            >
              <Icon size={22} className={isActive ? "text-[#9B7EC8]" : darkMode ? "text-[#6a6a6a]" : "text-[#9C8D84]"} />
              <span className={`text-xs ${isActive ? "text-[#9B7EC8] font-medium" : darkMode ? "text-[#6a6a6a]" : "text-[#9C8D84]"}`}>
                {t(tab.labelKey)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Main dashboard view
function DashboardView({ onNavigateToCreate, onNavigateToCampaigns, darkMode = false }: { onNavigateToCreate: () => void; onNavigateToCampaigns: () => void; darkMode?: boolean }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Active Campaigns" value="12" change="+2" icon={Target} />
        <StatCard label="Total Reach" value="45.2K" change="+18%" icon={Users} />
        <StatCard label="Conversions" value="1,284" change="+12%" icon={TrendingUp} />
        <StatCard label="Engagement" value="8.4%" change="+3.2%" icon={Zap} />
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="font-semibold text-[#2C2420] mb-3">Quick Actions</h3>
        <div className="space-y-3">
          <QuickActionCard
            icon={Sparkles}
            title="Create with AI"
            description="Generate stunning ads in seconds"
            onClick={onNavigateToCreate}
          />
          <QuickActionCard
            icon={Target}
            title="Launch Campaign"
            description="Deploy to multiple platforms"
            onClick={onNavigateToCampaigns}
          />
        </div>
      </div>

      {/* Recent ads */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-[#2C2420]">Recent Ads</h3>
          <button className="text-sm text-[#9B7EC8] font-medium flex items-center gap-1">
            View all <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <RecentAdCard
            title="Summer Sale - 50% Off"
            platform="Instagram"
            status="active"
            impressions="12.4K"
          />
          <RecentAdCard
            title="New Product Launch"
            platform="Facebook"
            status="active"
            impressions="8.2K"
          />
          <RecentAdCard
            title="Holiday Special"
            platform="Google Ads"
            status="paused"
            impressions="5.1K"
          />
          <RecentAdCard
            title="Brand Awareness"
            platform="TikTok"
            status="draft"
            impressions="0"
          />
        </div>
      </div>
    </div>
  )
}

// Flare starburst icon component
function FlareStarburst({ size = 48 }: { size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="animate-pulse-slow"
    >
      {/* Center dot */}
      <circle cx="24" cy="24" r="3" fill="#9B7EC8" />
      {/* Rays */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30) * (Math.PI / 180)
        const innerR = 6
        const outerR = i % 2 === 0 ? 20 : 14
        const x1 = 24 + Math.cos(angle) * innerR
        const y1 = 24 + Math.sin(angle) * innerR
        const x2 = 24 + Math.cos(angle) * outerR
        const y2 = 24 + Math.sin(angle) * outerR
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#9B7EC8"
            strokeWidth={i % 2 === 0 ? 2.5 : 2}
            strokeLinecap="round"
            opacity={i % 2 === 0 ? 1 : 0.6}
          />
        )
      })}
    </svg>
  )
}

// Get time-based greeting
function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 5) return "this late night"
  if (hour < 12) return "this morning"
  if (hour < 17) return "this afternoon"
  if (hour < 21) return "this evening"
  return "tonight"
}

// Ad style and format types for UI
type UIAdStyle = "minimal" | "bold" | "elegant" | "playful" | "professional" | "vintage"
type UIAdFormat = "square" | "story" | "landscape" | "portrait"
type UIAdPlatform = "instagram" | "facebook" | "google" | "tiktok"

// Generated ad type for UI state
interface UIGeneratedAd {
  id: string
  imageUrl: string
  prompt: string
  platform: UIAdPlatform
  format: UIAdFormat
  style: UIAdStyle
  headline?: string
  cta?: string
}

// Claude-style Create view with AI chat interface
function CreateView({ darkMode = false }: { darkMode?: boolean }) {
  const { t, adLanguage } = useLanguage()
  const [inputValue, setInputValue] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; preview: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const greeting = getGreeting()
  
  // AI Generation states
  const [step, setStep] = useState<"prompt" | "wizard" | "options" | "generating" | "result" | "preview">("prompt")
  const [selectedPlatform, setSelectedPlatform] = useState<UIAdPlatform>("instagram")
  const [selectedFormat, setSelectedFormat] = useState<UIAdFormat>("square")
  const [selectedStyle, setSelectedStyle] = useState<UIAdStyle>("professional")
  const [headline, setHeadline] = useState("")
  const [cta, setCta] = useState("")
  const [brandName, setBrandName] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAd, setGeneratedAd] = useState<UIGeneratedAd | null>(null)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [variations, setVariations] = useState<UIGeneratedAd[]>([])
  const [previewPlatform, setPreviewPlatform] = useState<UIAdPlatform>("instagram")

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setAttachedFiles(prev => [...prev, { name: file.name, preview: reader.result as string }])
        }
        reader.readAsDataURL(file)
      })
    }
    setShowAttachMenu(false)
  }

  const handleCameraCapture = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.capture = "environment"
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        Array.from(files).forEach(file => {
          const reader = new FileReader()
          reader.onloadend = () => {
            setAttachedFiles(prev => [...prev, { name: file.name, preview: reader.result as string }])
          }
          reader.readAsDataURL(file)
        })
      }
    }
    input.click()
    setShowAttachMenu(false)
  }

  const removeAttachment = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmitPrompt = () => {
    if (inputValue.trim()) {
      setStep("wizard")
    }
  }

  const handleGenerate = async () => {
    setStep("generating")
    setIsGenerating(true)
    setGenerationError(null)
    
    try {
      const response = await fetch("/api/generate-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: inputValue,
          brandName,
          style: selectedStyle,
          platform: selectedPlatform,
          format: selectedFormat,
          language: adLanguage,
          includeText: !!headline,
          headline,
          cta,
        }),
      })
      
      const data = await response.json()
      
      if (data.success && data.ad) {
        setGeneratedAd(data.ad)
        setStep("result")
      } else {
        throw new Error(data.error || "Failed to generate ad")
      }
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : "Failed to generate ad")
      setStep("options")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateVariations = async () => {
    if (!generatedAd) return
    
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-variations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalPrompt: `${inputValue}, ${selectedStyle} style, for ${selectedPlatform}`,
          variationType: "style",
          parentAdId: generatedAd.id,
          count: 3,
        }),
      })
      
      const data = await response.json()
      if (data.success && data.variations) {
        setVariations(data.variations.map((v: { id: string; imageUrl: string }) => ({
          ...generatedAd,
          id: v.id,
          imageUrl: v.imageUrl,
        })))
      }
    } catch (error) {
      console.error("Failed to generate variations:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleStartOver = () => {
    setStep("prompt")
    setInputValue("")
    setGeneratedAd(null)
    setVariations([])
    setHeadline("")
    setCta("")
    setBrandName("")
    setGenerationError(null)
  }

  const handleOpenPreview = (platform: UIAdPlatform) => {
    setPreviewPlatform(platform)
    setStep("preview")
  }

  const platforms: { id: UIAdPlatform; name: string; icon: string }[] = [
    { id: "instagram", name: "Instagram", icon: "IG" },
    { id: "facebook", name: "Facebook", icon: "FB" },
    { id: "google", name: "Google Ads", icon: "G" },
    { id: "tiktok", name: "TikTok", icon: "TT" },
  ]

  const formats: { id: UIAdFormat; name: string; ratio: string }[] = [
    { id: "square", name: "Square", ratio: "1:1" },
    { id: "story", name: "Story", ratio: "9:16" },
    { id: "landscape", name: "Landscape", ratio: "16:9" },
    { id: "portrait", name: "Portrait", ratio: "4:5" },
  ]

  const styles: { id: UIAdStyle; name: string; desc: string }[] = [
    { id: "minimal", name: "Minimal", desc: "Clean & simple" },
    { id: "bold", name: "Bold", desc: "Eye-catching" },
    { id: "elegant", name: "Elegant", desc: "Sophisticated" },
    { id: "playful", name: "Playful", desc: "Fun & creative" },
    { id: "professional", name: "Professional", desc: "Business-ready" },
    { id: "vintage", name: "Vintage", desc: "Retro vibes" },
  ]

  // Render Ad Creator wizard (triggered from prompt)
  if (step === "wizard") {
    return (
      <div className="h-[calc(100vh-8rem)] overflow-hidden">
        <AdCreator initialPrompt={inputValue} onBack={() => setStep("prompt")} />
      </div>
    )
  }

  // Render generating state
  if (step === "generating") {
    return (
      <div className="flex flex-col h-[calc(100vh-180px)] items-center justify-center animate-in fade-in duration-300">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-[#9B7EC8]/20 border-t-[#9B7EC8] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles size={32} className="text-[#9B7EC8] animate-pulse" />
          </div>
        </div>
        <h2 className="mt-8 text-xl font-semibold text-[#2C2420]">Creating your ad...</h2>
        <p className="mt-2 text-[#6B5D54] text-center max-w-xs">
          Our AI is generating a stunning {selectedStyle} ad for {selectedPlatform}
        </p>
        <div className="mt-6 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#9B7EC8] animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  // Render result state
  if (step === "result" && generatedAd) {
    return (
      <div className="flex flex-col h-[calc(100vh-180px)] animate-in fade-in duration-300 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-2 py-3 sticky top-0 bg-[#f5f0e8] z-10">
          <button 
            onClick={handleStartOver}
            className="flex items-center gap-2 px-3 py-2 text-[#6B5D54] hover:text-[#2C2420] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-medium">New Ad</span>
          </button>
          <span className="text-sm font-semibold text-[#2C2420]">Generated Ad</span>
          <div className="w-20" />
        </div>

        {/* Main generated ad */}
        <div className="px-4 pb-4">
          <div className="bg-white rounded-2xl border border-[#e8e2da] overflow-hidden shadow-sm">
            <div className="aspect-square relative bg-[#f5f0e8]">
              <img 
                src={generatedAd.imageUrl} 
                alt="Generated ad" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2 py-1 bg-black/60 text-white text-xs font-medium rounded-full capitalize">
                  {generatedAd.platform}
                </span>
                <span className="px-2 py-1 bg-[#9B7EC8] text-white text-xs font-medium rounded-full capitalize">
                  {generatedAd.style}
                </span>
              </div>
            </div>
            
            {/* Ad details */}
            <div className="p-4 space-y-3">
              {headline && (
                <div>
                  <p className="text-xs text-[#9C8D84] mb-1">Headline</p>
                  <p className="font-semibold text-[#2C2420]">{headline}</p>
                </div>
              )}
              {cta && (
                <div>
                  <p className="text-xs text-[#9C8D84] mb-1">Call to Action</p>
                  <span className="inline-block px-4 py-2 bg-[#9B7EC8] text-white rounded-lg text-sm font-medium">
                    {cta}
                  </span>
                </div>
              )}
              <div>
                <p className="text-xs text-[#9C8D84] mb-1">Prompt</p>
                <p className="text-sm text-[#6B5D54]">{generatedAd.prompt}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={handleGenerateVariations}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-[#e8e2da] rounded-xl text-[#2C2420] font-medium active:scale-95 transition-transform disabled:opacity-50"
            >
              <Sparkles size={18} />
              <span>{isGenerating ? "Generating..." : "Create Variations"}</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-[#9B7EC8] rounded-xl text-white font-medium active:scale-95 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Save Ad</span>
            </button>
          </div>

          {/* Variations */}
          {variations.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-[#2C2420] mb-3">Variations</h3>
              <div className="grid grid-cols-3 gap-2">
                {variations.map((variation) => (
                  <button
                    key={variation.id}
                    onClick={() => setGeneratedAd(variation)}
                    className="aspect-square rounded-xl overflow-hidden bg-[#f5f0e8] border-2 border-transparent hover:border-[#9B7EC8] transition-colors"
                  >
                    <img src={variation.imageUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Platform preview & publish */}
          <div className="mt-6">
            <h3 className="font-semibold text-[#2C2420] mb-1">Preview & Publish</h3>
            <p className="text-xs text-[#9C8D84] mb-3">See how your ad looks on each platform before publishing</p>
            <div className="grid grid-cols-4 gap-2">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleOpenPreview(p.id)}
                  className="flex flex-col items-center gap-1 p-3 bg-white border border-[#e8e2da] rounded-xl active:scale-95 transition-all hover:border-[#9B7EC8] hover:shadow-sm"
                >
                  <span className="text-lg font-bold text-[#9B7EC8]">{p.icon}</span>
                  <span className="text-xs text-[#6B5D54]">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render preview state
  if (step === "preview" && generatedAd) {
    const platformLabels: Record<UIAdPlatform, string> = {
      instagram: "Instagram",
      facebook: "Facebook",
      google: "Google Display",
      tiktok: "TikTok",
    }
    return (
      <div className="flex flex-col h-[calc(100vh-180px)] animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-2 py-3 bg-[#f5f0e8]">
          <button
            onClick={() => setStep("result")}
            className="flex items-center gap-2 px-3 py-2 text-[#6B5D54] hover:text-[#2C2420] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>
          <span className="text-sm font-semibold text-[#2C2420]">Ad Preview</span>
          <div className="w-16" />
        </div>

        {/* Platform tabs */}
        <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-hide">
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => setPreviewPlatform(p.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                previewPlatform === p.id
                  ? "bg-[#9B7EC8] text-white"
                  : "bg-white border border-[#e8e2da] text-[#6B5D54]"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Platform mockup */}
        <div className="flex-1 overflow-y-auto px-4 py-2 pb-6">

          {/* Instagram mockup */}
          {previewPlatform === "instagram" && (
            <div className="bg-white rounded-2xl border border-[#e8e2da] overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px] flex-shrink-0">
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-orange-400 to-pink-500" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold leading-none">{brandName || "yourbrand"}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Sponsored</p>
                  </div>
                </div>
                <span className="text-gray-400 font-bold tracking-widest text-xs">···</span>
              </div>
              <div className="aspect-square">
                <img src={generatedAd.imageUrl} alt="Ad preview" className="w-full h-full object-cover" />
              </div>
              <div className="px-3 py-2.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="#2C2420" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#2C2420" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="#2C2420" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="#2C2420" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p className="text-[12px] font-semibold text-[#2C2420]">1,284 likes</p>
                {headline && (
                  <p className="text-[12px] text-[#2C2420]">
                    <span className="font-semibold">{brandName || "yourbrand"}</span>{" "}{headline}
                  </p>
                )}
                {cta && (
                  <button className="w-full mt-1 py-2 bg-[#405DE6] text-white text-[12px] font-semibold rounded-md">
                    {cta}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Facebook mockup */}
          {previewPlatform === "facebook" && (
            <div className="bg-white rounded-2xl border border-[#e8e2da] overflow-hidden shadow-sm">
              <div className="px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {(brandName || "Y").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-[#050505] truncate">{brandName || "Your Brand Page"}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-gray-500">Sponsored</span>
                      <span className="text-gray-400 text-[10px]">·</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-gray-500"><circle cx="12" cy="12" r="10"/></svg>
                    </div>
                  </div>
                  <span className="text-gray-400 font-bold tracking-widest text-xs">···</span>
                </div>
                {headline && <p className="mt-2 text-[13px] text-[#050505]">{headline}</p>}
              </div>
              <div className="aspect-video">
                <img src={generatedAd.imageUrl} alt="Ad preview" className="w-full h-full object-cover" />
              </div>
              <div className="px-3 py-2.5 bg-[#F0F2F5]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-semibold text-[#050505] uppercase tracking-wide">{brandName?.toUpperCase() || "YOURBRAND.COM"}</p>
                  {cta && (
                    <button className="px-3 py-1.5 bg-[#E7E9EB] text-[#050505] text-[12px] font-semibold rounded-md">
                      {cta}
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-300">
                  <div className="flex items-center gap-1">
                    <span className="text-base">👍❤️😆</span>
                    <span className="text-[11px] text-gray-600 ml-1">847</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-[11px] text-gray-500">64 comments</span>
                    <span className="text-[11px] text-gray-500">19 shares</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Google Display mockup */}
          {previewPlatform === "google" && (
            <div className="bg-white rounded-2xl border border-[#e8e2da] overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-gray-500 border border-gray-400 rounded px-1 py-0.5 font-medium">Ad</span>
                  <span className="text-[10px] text-gray-500">·</span>
                  <span className="text-[10px] text-[#006621]">{(brandName || "yourbrand").toLowerCase().replace(/\s/g, "")}.com</span>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#9AA0A6" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <div className="aspect-video">
                <img src={generatedAd.imageUrl} alt="Ad preview" className="w-full h-full object-cover" />
              </div>
              <div className="px-4 py-3">
                {headline && <p className="text-[15px] font-medium text-[#1A0DAB] leading-snug">{headline}</p>}
                <p className="text-[11px] text-[#006621] mt-0.5">{(brandName || "yourbrand").toLowerCase().replace(/\s/g, "")}.com</p>
                {cta && (
                  <button className="mt-3 px-5 py-2 bg-[#1A73E8] text-white text-[13px] font-medium rounded-full">
                    {cta}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TikTok mockup */}
          {previewPlatform === "tiktok" && (
            <div className="bg-black rounded-2xl overflow-hidden shadow-sm">
              <div className="aspect-[9/16] relative">
                <img src={generatedAd.imageUrl} alt="Ad preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
                {/* Top nav */}
                <div className="absolute top-3 left-0 right-0 flex items-center justify-center gap-6">
                  <span className="text-white/60 text-[13px] font-medium">Following</span>
                  <span className="text-white text-[13px] font-semibold border-b-2 border-white pb-0.5">For You</span>
                </div>
                {/* Right sidebar */}
                <div className="absolute right-3 bottom-20 flex flex-col items-center gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500" />
                    </div>
                    <div className="w-5 h-5 rounded-full bg-[#FE2C55] flex items-center justify-center -mt-2.5 border-2 border-black">
                      <span className="text-white text-[10px] font-bold">+</span>
                    </div>
                  </div>
                  {[["❤️","47.2K"],["💬","1,284"],["🔖","8,391"],["↗️","Share"]].map(([icon, label]) => (
                    <div key={label} className="flex flex-col items-center gap-0.5">
                      <span className="text-2xl">{icon}</span>
                      <span className="text-white text-[10px]">{label}</span>
                    </div>
                  ))}
                </div>
                {/* Bottom info */}
                <div className="absolute bottom-4 left-3 right-16">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-white text-[13px] font-semibold">@{(brandName || "yourbrand").toLowerCase().replace(/\s/g, "_")}</span>
                    <span className="px-1.5 py-0.5 bg-[#FE2C55]/90 text-white text-[9px] font-semibold rounded">Sponsored</span>
                  </div>
                  {headline && <p className="text-white/90 text-[12px] leading-snug line-clamp-2">{headline}</p>}
                  {cta && (
                    <button className="mt-2 px-4 py-1.5 bg-[#FE2C55] text-white text-[12px] font-semibold rounded-full">
                      {cta}
                    </button>
                  )}
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-white/70 text-[11px]">♫</span>
                    <p className="text-white/70 text-[10px] truncate">Original Sound · {brandName || "Your Brand"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Publish CTA */}
        <div className="px-4 py-3 bg-[#f5f0e8] border-t border-[#e8e2da]">
          <button className="w-full py-4 bg-gradient-to-r from-[#9B7EC8] to-[#8A6DB8] text-white font-semibold rounded-xl shadow-lg shadow-[#9B7EC8]/30 active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Publish to {platformLabels[previewPlatform]}</span>
          </button>
        </div>
      </div>
    )
  }

  // Render options state
  if (step === "options") {
    return (
      <div className="flex flex-col h-[calc(100vh-180px)] animate-in fade-in duration-300 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-2 py-3 sticky top-0 bg-[#f5f0e8] z-10">
          <button 
            onClick={() => setStep("prompt")}
            className="flex items-center gap-2 px-3 py-2 text-[#6B5D54] hover:text-[#2C2420] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>
          <span className="text-sm font-semibold text-[#2C2420]">Customize Ad</span>
          <div className="w-16" />
        </div>

        <div className="px-4 pb-4 space-y-5">
          {/* Prompt preview */}
          <div className="bg-white rounded-2xl border border-[#e8e2da] p-4">
            <p className="text-xs text-[#9C8D84] mb-1">Your prompt</p>
            <p className="text-[#2C2420]">{inputValue}</p>
          </div>

          {generationError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm">{generationError}</p>
            </div>
          )}

          {/* Platform selection */}
          <div>
            <p className="text-sm font-medium text-[#2C2420] mb-2">Platform</p>
            <div className="grid grid-cols-4 gap-2">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlatform(p.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                    selectedPlatform === p.id
                      ? "border-[#9B7EC8] bg-[#9B7EC8]/5"
                      : "border-[#e8e2da] bg-white"
                  }`}
                >
                  <span className={`text-lg font-bold ${selectedPlatform === p.id ? "text-[#9B7EC8]" : "text-[#6B5D54]"}`}>
                    {p.icon}
                  </span>
                  <span className="text-xs text-[#6B5D54]">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Format selection */}
          <div>
            <p className="text-sm font-medium text-[#2C2420] mb-2">Format</p>
            <div className="grid grid-cols-4 gap-2">
              {formats.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFormat(f.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                    selectedFormat === f.id
                      ? "border-[#9B7EC8] bg-[#9B7EC8]/5"
                      : "border-[#e8e2da] bg-white"
                  }`}
                >
                  <span className={`text-sm font-semibold ${selectedFormat === f.id ? "text-[#9B7EC8]" : "text-[#2C2420]"}`}>
                    {f.name}
                  </span>
                  <span className="text-xs text-[#9C8D84]">{f.ratio}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Style selection */}
          <div>
            <p className="text-sm font-medium text-[#2C2420] mb-2">Style</p>
            <div className="grid grid-cols-3 gap-2">
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStyle(s.id)}
                  className={`flex flex-col items-start p-3 rounded-xl border-2 transition-all ${
                    selectedStyle === s.id
                      ? "border-[#9B7EC8] bg-[#9B7EC8]/5"
                      : "border-[#e8e2da] bg-white"
                  }`}
                >
                  <span className={`text-sm font-semibold ${selectedStyle === s.id ? "text-[#9B7EC8]" : "text-[#2C2420]"}`}>
                    {s.name}
                  </span>
                  <span className="text-xs text-[#9C8D84]">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional fields */}
          <div>
            <p className="text-sm font-medium text-[#2C2420] mb-2">Brand Name (optional)</p>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Your brand name"
              className="w-full px-4 py-3 bg-white border border-[#e8e2da] rounded-xl text-[#2C2420] placeholder-[#9C8D84] outline-none focus:border-[#9B7EC8] transition-colors"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-[#2C2420] mb-2">Headline (optional)</p>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g., Summer Sale - 50% Off"
              className="w-full px-4 py-3 bg-white border border-[#e8e2da] rounded-xl text-[#2C2420] placeholder-[#9C8D84] outline-none focus:border-[#9B7EC8] transition-colors"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-[#2C2420] mb-2">Call to Action (optional)</p>
            <input
              type="text"
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              placeholder="e.g., Shop Now, Learn More"
              className="w-full px-4 py-3 bg-white border border-[#e8e2da] rounded-xl text-[#2C2420] placeholder-[#9C8D84] outline-none focus:border-[#9B7EC8] transition-colors"
            />
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            className="w-full py-4 bg-gradient-to-r from-[#9B7EC8] to-[#8A6DB8] text-white font-semibold rounded-xl shadow-lg shadow-[#9B7EC8]/30 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <Sparkles size={20} />
            <span>Generate Ad</span>
          </button>
        </div>
      </div>
    )
  }

  // Default prompt state
  return (
    <div className="flex flex-col h-[calc(100vh-180px)] animate-in fade-in duration-300">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Header with model selector */}
      <div className="flex items-center justify-between px-2 py-3">
        <button className="w-10 h-10 rounded-full bg-white border border-[#e8e2da] flex items-center justify-center active:scale-95 transition-transform">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 6h14M3 10h14M3 14h14" stroke="#6B5D54" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-[#e8e2da] active:scale-95 transition-transform">
          <span className="text-sm font-semibold text-[#2C2420]">Flare Pro</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="#6B5D54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <button className="w-10 h-10 rounded-full bg-white border border-[#e8e2da] flex items-center justify-center active:scale-95 transition-transform">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#9B7EC8] to-[#8A6DB8] flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
        </button>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <FlareStarburst size={56} />
        <h1 className="text-2xl font-serif text-[#2C2420] text-center mt-6 leading-relaxed">
          {t("howCanIHelp")} {greeting}?
        </h1>
      </div>

      {/* Bottom input area */}
      <div className="px-4 pb-4">
        {/* Attached files preview */}
        {attachedFiles.length > 0 && (
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
            {attachedFiles.map((file, index) => (
              <div key={index} className="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-[#f5f0e8]">
                <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeAttachment(index)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-[#2C2420] rounded-full flex items-center justify-center text-white shadow-lg"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-[#e8e2da] shadow-sm overflow-hidden relative">
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-[#9C8D84]">{t("adLanguage")}:</span>
              <span className="text-xs font-medium text-[#9B7EC8] bg-[#9B7EC8]/10 px-2 py-0.5 rounded-full">{languageNames[adLanguage]}</span>
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmitPrompt()}
              placeholder={t("createAdFor")}
              className="w-full text-[#2C2420] placeholder-[#9C8D84] text-base outline-none bg-transparent"
            />
          </div>
          <div className="flex items-center justify-between px-3 pb-3">
            <div className="relative">
              <button 
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                  showAttachMenu ? "bg-[#9B7EC8] text-white" : "text-[#6B5D54] hover:bg-[#f5f0e8]"
                }`}
              >
                <Plus size={22} className={`transition-transform duration-200 ${showAttachMenu ? "rotate-45" : ""}`} />
              </button>

              {/* Attachment menu popup */}
              {showAttachMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowAttachMenu(false)} 
                  />
                  <div className="absolute bottom-12 left-0 z-50 bg-white rounded-2xl shadow-xl border border-[#e8e2da] p-2 min-w-[200px] animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#f5f0e8] transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#9B7EC8]/10 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]">
                          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                          <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-[#2C2420] text-sm">{t("photoLibrary")}</p>
                        <p className="text-xs text-[#6B5D54]">{t("cameraRoll")}</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={handleCameraCapture}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#f5f0e8] transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#9B7EC8]/10 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-[#2C2420] text-sm">{t("takePhoto")}</p>
                        <p className="text-xs text-[#6B5D54]">{t("useCamera")}</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        fileInputRef.current?.click()
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#f5f0e8] transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#9B7EC8]/10 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-[#2C2420] text-sm">{t("browseFiles")}</p>
                        <p className="text-xs text-[#6B5D54]">{t("chooseFromFolders")}</p>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#6B5D54] hover:bg-[#f5f0e8] active:scale-95 transition-all"
                onClick={() => setIsListening(!isListening)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 1a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 8v2a5 5 0 0 1-10 0V8M10 15v4M7 19h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <button 
                onClick={handleSubmitPrompt}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                  inputValue.trim() 
                    ? "bg-[#9B7EC8] text-white" 
                    : "bg-[#e8e2da] text-[#9C8D84]"
                }`}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Quick suggestion chips */}
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
          {["Instagram Story", "Facebook Ad", "Google Display", "TikTok Video"].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInputValue(`Create a ${suggestion.toLowerCase()} for `)}
              className="px-3 py-1.5 text-sm text-[#6B5D54] bg-white border border-[#e8e2da] rounded-full hover:border-[#9B7EC8] hover:text-[#9B7EC8] active:scale-95 transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Ad preview card with visual creative
function AdPreviewCard({
  id,
  name,
  platform,
  status,
  imageUrl,
  headline,
  description,
  cta,
  spend,
  impressions,
  clicks,
  conversions,
  ctr,
  onSelect
}: {
  id: string
  name: string
  platform: "instagram" | "facebook" | "google" | "tiktok"
  status: "active" | "paused" | "draft" | "ended"
  imageUrl: string
  headline: string
  description: string
  cta: string
  spend: string
  impressions: string
  clicks: string
  conversions: string
  ctr: string
  onSelect?: (id: string) => void
}) {
  const statusColors = {
    active: "bg-[#5C9A6E] text-white",
    paused: "bg-[#B8924A] text-white",
    draft: "bg-[#9C8D84] text-white",
    ended: "bg-[#6B5D54] text-white"
  }

  const platformIcons = {
    instagram: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect width="14" height="14" rx="4" fill="url(#ig-gradient)"/>
        <rect x="3" y="3" width="8" height="8" rx="2" stroke="white" strokeWidth="1.2"/>
        <circle cx="7" cy="7" r="1.5" stroke="white" strokeWidth="1.2"/>
        <circle cx="9.5" cy="4.5" r="0.75" fill="white"/>
        <defs>
          <linearGradient id="ig-gradient" x1="0" y1="14" x2="14" y2="0">
            <stop stopColor="#FFDC80"/>
            <stop offset="0.5" stopColor="#F56040"/>
            <stop offset="1" stopColor="#C13584"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    facebook: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="7" fill="#1877F2"/>
        <path d="M9.5 7.5h-1.5v3h-1.5v-3H5.5V6.25h1v-1c0-1 .5-1.75 1.75-1.75H9.5v1.25H8.75c-.35 0-.5.15-.5.5v1h1.25l-.25 1.25z" fill="white"/>
      </svg>
    ),
    google: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="7" fill="#4285F4"/>
        <path d="M7 4c1.1 0 2 .3 2.7 1l-1.1 1.1c-.4-.4-1-.6-1.6-.6-1.4 0-2.5 1.1-2.5 2.5S5.6 10.5 7 10.5c1.2 0 2.1-.7 2.3-1.5H7V7.5h4c0 2.2-1.5 4-4 4-2.2 0-4-1.8-4-4s1.8-4 4-4z" fill="white"/>
      </svg>
    ),
    tiktok: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect width="14" height="14" rx="3" fill="black"/>
        <path d="M10 5.5V8c0 1.7-1.3 3-3 3s-3-1.3-3-3 1.3-3 3-3v1.5c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5V3h1.5c0 1.4 1.1 2.5 2.5 2.5v1.5c-.7 0-1.4-.2-2-.5z" fill="white"/>
      </svg>
    )
  }

  const platformNames = {
    instagram: "Instagram",
    facebook: "Facebook",
    google: "Google Ads",
    tiktok: "TikTok"
  }

  return (
    <button
      onClick={() => onSelect?.(id)}
      className="w-full bg-white rounded-2xl border border-[#e8e2da] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left"
    >
      {/* Ad creative preview */}
      <div className="relative aspect-[4/5] bg-[#f5f0e8]">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
        {/* Status badge */}
        <div className="absolute top-2 left-2">
          <span className={`text-[10px] font-semibold px-2 py-1 rounded-full capitalize ${statusColors[status]}`}>
            {status}
          </span>
        </div>
        {/* Platform badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
          {platformIcons[platform]}
          <span className="text-[10px] font-medium text-[#2C2420]">{platformNames[platform]}</span>
        </div>
        {/* Ad copy overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
          <p className="text-white font-semibold text-sm leading-tight line-clamp-2 mb-1">{headline}</p>
          <p className="text-white/80 text-xs line-clamp-1">{description}</p>
          <div className="mt-2">
            <span className="inline-block bg-white text-[#2C2420] text-xs font-semibold px-3 py-1 rounded-full">
              {cta}
            </span>
          </div>
        </div>
      </div>
      {/* Performance metrics */}
      <div className="p-3">
        <p className="font-medium text-[#2C2420] text-sm truncate mb-2">{name}</p>
        <div className="grid grid-cols-4 gap-1 text-center">
          <div>
            <p className="text-[10px] text-[#6B5D54]">Spend</p>
            <p className="text-xs font-semibold text-[#2C2420]">{spend}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#6B5D54]">Impr.</p>
            <p className="text-xs font-semibold text-[#2C2420]">{impressions}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#6B5D54]">Clicks</p>
            <p className="text-xs font-semibold text-[#2C2420]">{clicks}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#6B5D54]">CTR</p>
            <p className="text-xs font-semibold text-[#5C9A6E]">{ctr}</p>
          </div>
        </div>
      </div>
    </button>
  )
}

// View mode toggle icons
function GridIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="1.5" fill={active ? "#9B7EC8" : "#9C8D84"} />
      <rect x="11" y="2" width="7" height="7" rx="1.5" fill={active ? "#9B7EC8" : "#9C8D84"} />
      <rect x="2" y="11" width="7" height="7" rx="1.5" fill={active ? "#9B7EC8" : "#9C8D84"} />
      <rect x="11" y="11" width="7" height="7" rx="1.5" fill={active ? "#9B7EC8" : "#9C8D84"} />
    </svg>
  )
}

function CarouselIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="5" y="2" width="10" height="16" rx="2" fill={active ? "#9B7EC8" : "#9C8D84"} />
      <rect x="1" y="4" width="3" height="12" rx="1" fill={active ? "#9B7EC8" : "#9C8D84"} opacity="0.4" />
      <rect x="16" y="4" width="3" height="12" rx="1" fill={active ? "#9B7EC8" : "#9C8D84"} opacity="0.4" />
    </svg>
  )
}

// Campaign header with title, view toggle, and filter tabs
function CampaignHeader({ 
  activeFilter, 
  onFilterChange,
  viewMode,
  onViewModeChange,
  totalAds
}: { 
  activeFilter: string
  onFilterChange: (filter: string) => void
  viewMode: "carousel" | "grid"
  onViewModeChange: (mode: "carousel" | "grid") => void
  totalAds: number
}) {
  const filters = [
    { id: "all", label: "All", count: totalAds },
    { id: "active", label: "Active" },
    { id: "paused", label: "Paused" },
    { id: "draft", label: "Drafts" }
  ]

  return (
    <div className="space-y-3">
      {/* Title row with view toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#2C2420]">Your Ads</h2>
          <p className="text-xs text-[#6B5D54]">{totalAds} campaigns</p>
        </div>
        <div className="flex gap-1 bg-white border border-[#e8e2da] rounded-xl p-1 shadow-sm">
          <button
            onClick={() => onViewModeChange("carousel")}
            className={`p-2 rounded-lg transition-all duration-200 ${
              viewMode === "carousel" ? "bg-[#9B7EC8]/10" : "hover:bg-[#f5f0e8]"
            }`}
            aria-label="Carousel view"
          >
            <CarouselIcon active={viewMode === "carousel"} />
          </button>
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-2 rounded-lg transition-all duration-200 ${
              viewMode === "grid" ? "bg-[#9B7EC8]/10" : "hover:bg-[#f5f0e8]"
            }`}
            aria-label="Grid view"
          >
            <GridIcon active={viewMode === "grid"} />
          </button>
        </div>
      </div>
      
      {/* Filter pills row */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeFilter === f.id
                ? "bg-[#9B7EC8] text-white shadow-sm shadow-[#9B7EC8]/25"
                : "bg-white border border-[#e8e2da] text-[#6B5D54] hover:border-[#9B7EC8]/40 hover:text-[#9B7EC8]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// Full-size carousel ad card
function CarouselAdCard({
  ad,
  isActive,
  offset
}: {
  ad: {
    id: string
    name: string
    platform: "instagram" | "facebook" | "google" | "tiktok"
    status: "active" | "paused" | "draft" | "ended"
    imageUrl: string
    headline: string
    description: string
    cta: string
    spend: string
    impressions: string
    clicks: string
    conversions: string
    ctr: string
  }
  isActive: boolean
  offset: number
}) {
  const statusColors = {
    active: "bg-[#5C9A6E] text-white",
    paused: "bg-[#B8924A] text-white",
    draft: "bg-[#9C8D84] text-white",
    ended: "bg-[#6B5D54] text-white"
  }

  const platformIcons = {
    instagram: (
      <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
        <rect width="14" height="14" rx="4" fill="url(#ig-gradient-carousel)"/>
        <rect x="3" y="3" width="8" height="8" rx="2" stroke="white" strokeWidth="1.2"/>
        <circle cx="7" cy="7" r="1.5" stroke="white" strokeWidth="1.2"/>
        <circle cx="9.5" cy="4.5" r="0.75" fill="white"/>
        <defs>
          <linearGradient id="ig-gradient-carousel" x1="0" y1="14" x2="14" y2="0">
            <stop stopColor="#FFDC80"/>
            <stop offset="0.5" stopColor="#F56040"/>
            <stop offset="1" stopColor="#C13584"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    facebook: (
      <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="7" fill="#1877F2"/>
        <path d="M9.5 7.5h-1.5v3h-1.5v-3H5.5V6.25h1v-1c0-1 .5-1.75 1.75-1.75H9.5v1.25H8.75c-.35 0-.5.15-.5.5v1h1.25l-.25 1.25z" fill="white"/>
      </svg>
    ),
    google: (
      <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="7" fill="#4285F4"/>
        <path d="M7 4c1.1 0 2 .3 2.7 1l-1.1 1.1c-.4-.4-1-.6-1.6-.6-1.4 0-2.5 1.1-2.5 2.5S5.6 10.5 7 10.5c1.2 0 2.1-.7 2.3-1.5H7V7.5h4c0 2.2-1.5 4-4 4-2.2 0-4-1.8-4-4s1.8-4 4-4z" fill="white"/>
      </svg>
    ),
    tiktok: (
      <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
        <rect width="14" height="14" rx="3" fill="black"/>
        <path d="M10 5.5V8c0 1.7-1.3 3-3 3s-3-1.3-3-3 1.3-3 3-3v1.5c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5V3h1.5c0 1.4 1.1 2.5 2.5 2.5v1.5c-.7 0-1.4-.2-2-.5z" fill="white"/>
      </svg>
    )
  }

  const platformNames = {
    instagram: "Instagram",
    facebook: "Facebook",
    google: "Google Ads",
    tiktok: "TikTok"
  }

  // Calculate transform based on offset from active card
  const scale = isActive ? 1 : 0.85
  const opacity = isActive ? 1 : 0.6
  const translateX = offset * 85 // percentage offset

  return (
    <div
      className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out"
      style={{
        transform: `translateX(${translateX}%) scale(${scale})`,
        opacity,
        zIndex: isActive ? 10 : 5 - Math.abs(offset)
      }}
    >
      <div className="w-[280px] bg-white rounded-3xl border border-[#e8e2da] overflow-hidden shadow-xl">
        {/* Ad creative preview */}
        <div className="relative aspect-[4/5] bg-[#f5f0e8]">
          <img
            src={ad.imageUrl}
            alt={ad.name}
            className="w-full h-full object-cover"
          />
          {/* Status badge */}
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize shadow-lg ${statusColors[ad.status]}`}>
              {ad.status}
            </span>
          </div>
          {/* Platform badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
            {platformIcons[ad.platform]}
            <span className="text-xs font-medium text-[#2C2420]">{platformNames[ad.platform]}</span>
          </div>
          {/* Ad copy overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
            <p className="text-white font-bold text-lg leading-tight line-clamp-2 mb-1">{ad.headline}</p>
            <p className="text-white/80 text-sm line-clamp-2 mb-3">{ad.description}</p>
            <span className="inline-block bg-white text-[#2C2420] text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
              {ad.cta}
            </span>
          </div>
        </div>
        {/* Performance metrics */}
        <div className="p-4 bg-white">
          <p className="font-semibold text-[#2C2420] mb-3 truncate">{ad.name}</p>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center">
              <p className="text-xs text-[#6B5D54] mb-1">Spend</p>
              <p className="text-sm font-bold text-[#2C2420]">{ad.spend}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[#6B5D54] mb-1">Impr.</p>
              <p className="text-sm font-bold text-[#2C2420]">{ad.impressions}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[#6B5D54] mb-1">Clicks</p>
              <p className="text-sm font-bold text-[#2C2420]">{ad.clicks}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[#6B5D54] mb-1">CTR</p>
              <p className="text-sm font-bold text-[#5C9A6E]">{ad.ctr}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Carousel dots indicator
function CarouselDots({ total, current, onChange }: { total: number; current: number; onChange: (index: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`transition-all duration-300 rounded-full ${
            i === current 
              ? "w-6 h-2 bg-[#9B7EC8]" 
              : "w-2 h-2 bg-[#e8e2da] hover:bg-[#9B7EC8]/50"
          }`}
        />
      ))}
    </div>
  )
}

// Upload modal for adding your own ads
function UploadModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void 
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [adName, setAdName] = useState("")
  const [platform, setPlatform] = useState<string>("")
  const [step, setStep] = useState<"upload" | "details">("upload")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith("image/") || file.type.startsWith("video/")
    )
    handleFiles(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleClose = () => {
    setUploadedFiles([])
    setPreviews([])
    setAdName("")
    setPlatform("")
    setStep("upload")
    onClose()
  }

  const platforms = [
    { id: "instagram", name: "Instagram", icon: "IG" },
    { id: "facebook", name: "Facebook", icon: "FB" },
    { id: "google", name: "Google Ads", icon: "G" },
    { id: "tiktok", name: "TikTok", icon: "TT" }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#e8e2da] px-4 py-4 flex items-center justify-between z-10">
          <button onClick={handleClose} className="p-2 -ml-2 text-[#6B5D54]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <h2 className="font-semibold text-[#2C2420]">
            {step === "upload" ? "Upload Creative" : "Ad Details"}
          </h2>
          <div className="w-10" />
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {step === "upload" ? (
            <div className="space-y-4">
              {/* Drop zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                  isDragging 
                    ? "border-[#9B7EC8] bg-[#9B7EC8]/5" 
                    : "border-[#e8e2da] hover:border-[#9B7EC8]/50 hover:bg-[#f5f0e8]/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#9B7EC8]/10 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                
                <p className="font-semibold text-[#2C2420] mb-1">
                  {isDragging ? "Drop files here" : "Drag & drop files"}
                </p>
                <p className="text-sm text-[#6B5D54] mb-4">
                  or tap to browse from your device
                </p>
                
                <div className="flex items-center justify-center gap-4 text-xs text-[#9C8D84]">
                  <span>JPG, PNG, GIF</span>
                  <span>MP4, MOV</span>
                  <span>Max 50MB</span>
                </div>
              </div>

              {/* Quick access buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-3 p-4 bg-white border border-[#e8e2da] rounded-xl hover:border-[#9B7EC8]/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#f5f0e8] flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                      <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-[#2C2420] text-sm">Photo Library</p>
                    <p className="text-xs text-[#6B5D54]">Camera roll</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => {
                    const input = document.createElement("input")
                    input.type = "file"
                    input.accept = "image/*"
                    input.capture = "environment"
                    input.onchange = (e) => {
                      const files = (e.target as HTMLInputElement).files
                      if (files) handleFiles(Array.from(files))
                    }
                    input.click()
                  }}
                  className="flex items-center gap-3 p-4 bg-white border border-[#e8e2da] rounded-xl hover:border-[#9B7EC8]/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#f5f0e8] flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-[#2C2420] text-sm">Take Photo</p>
                    <p className="text-xs text-[#6B5D54]">Use camera</p>
                  </div>
                </button>
              </div>

              {/* Uploaded files preview */}
              {previews.length > 0 && (
                <div className="space-y-3">
                  <p className="font-medium text-[#2C2420] text-sm">Uploaded ({previews.length})</p>
                  <div className="grid grid-cols-3 gap-2">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-[#f5f0e8]">
                        <img src={preview} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFile(index)
                          }}
                          className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview */}
              {previews.length > 0 && (
                <div className="aspect-video rounded-xl overflow-hidden bg-[#f5f0e8]">
                  <img src={previews[0]} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Ad name */}
              <div>
                <label className="block text-sm font-medium text-[#2C2420] mb-2">Ad Name</label>
                <input
                  type="text"
                  value={adName}
                  onChange={(e) => setAdName(e.target.value)}
                  placeholder="e.g., Summer Sale Campaign"
                  className="w-full px-4 py-3 border border-[#e8e2da] rounded-xl text-[#2C2420] placeholder-[#9C8D84] focus:border-[#9B7EC8] focus:ring-1 focus:ring-[#9B7EC8] outline-none transition-colors"
                />
              </div>

              {/* Platform selection */}
              <div>
                <label className="block text-sm font-medium text-[#2C2420] mb-2">Platform</label>
                <div className="grid grid-cols-2 gap-2">
                  {platforms.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlatform(p.id)}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        platform === p.id
                          ? "border-[#9B7EC8] bg-[#9B7EC8]/5"
                          : "border-[#e8e2da] hover:border-[#9B7EC8]/40"
                      }`}
                    >
                      <p className="font-medium text-[#2C2420]">{p.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-[#e8e2da] p-4 pb-safe">
          {step === "upload" ? (
            <button
              onClick={() => previews.length > 0 && setStep("details")}
              disabled={previews.length === 0}
              className={`w-full py-4 rounded-xl font-semibold transition-all ${
                previews.length > 0
                  ? "bg-[#9B7EC8] text-white active:scale-[0.98]"
                  : "bg-[#e8e2da] text-[#9C8D84] cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setStep("upload")}
                className="flex-1 py-4 rounded-xl font-semibold border border-[#e8e2da] text-[#6B5D54] active:scale-[0.98] transition-transform"
              >
                Back
              </button>
              <button
                onClick={handleClose}
                disabled={!adName || !platform}
                className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                  adName && platform
                    ? "bg-[#9B7EC8] text-white active:scale-[0.98]"
                    : "bg-[#e8e2da] text-[#9C8D84] cursor-not-allowed"
                }`}
              >
                Add Ad
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CampaignsView({ onNavigateToCreate, darkMode = false }: { onNavigateToCreate: () => void; darkMode?: boolean }) {
  const [filter, setFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)

  // Mock ad data - will be replaced with Meta API data
  const mockAds = [
    {
      id: "1",
      name: "Summer Sale Campaign",
      platform: "instagram" as const,
      status: "active" as const,
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop",
      headline: "Summer Sale - Up to 50% Off!",
      description: "Limited time offer on all summer essentials",
      cta: "Shop Now",
      spend: "$420",
      impressions: "12.4K",
      clicks: "356",
      conversions: "42",
      ctr: "2.87%"
    },
    {
      id: "2",
      name: "New Product Launch",
      platform: "facebook" as const,
      status: "active" as const,
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop",
      headline: "Introducing Our Latest Innovation",
      description: "Be the first to experience the future",
      cta: "Learn More",
      spend: "$280",
      impressions: "8.2K",
      clicks: "245",
      conversions: "28",
      ctr: "2.99%"
    },
    {
      id: "3",
      name: "Holiday Promo 2025",
      platform: "google" as const,
      status: "paused" as const,
      imageUrl: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=500&fit=crop",
      headline: "Holiday Deals Are Here",
      description: "Save big this holiday season",
      cta: "Get Deal",
      spend: "$180",
      impressions: "5.1K",
      clicks: "148",
      conversions: "18",
      ctr: "2.90%"
    },
    {
      id: "4",
      name: "Brand Awareness",
      platform: "tiktok" as const,
      status: "draft" as const,
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=500&fit=crop",
      headline: "Discover What Makes Us Different",
      description: "Join thousands of happy customers",
      cta: "Follow Us",
      spend: "$0",
      impressions: "0",
      clicks: "0",
      conversions: "0",
      ctr: "0%"
    },
    {
      id: "5",
      name: "Flash Sale Weekend",
      platform: "instagram" as const,
      status: "active" as const,
      imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop",
      headline: "48 Hours Only - Don't Miss Out!",
      description: "Exclusive deals for our followers",
      cta: "Shop Sale",
      spend: "$150",
      impressions: "6.8K",
      clicks: "198",
      conversions: "24",
      ctr: "2.91%"
    },
    {
      id: "6",
      name: "Retargeting Campaign",
      platform: "facebook" as const,
      status: "active" as const,
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=500&fit=crop",
      headline: "Still Thinking About It?",
      description: "Complete your purchase today",
      cta: "Buy Now",
      spend: "$95",
      impressions: "3.2K",
      clicks: "112",
      conversions: "15",
      ctr: "3.50%"
    }
  ]

  const filteredAds = filter === "all" 
    ? mockAds 
    : mockAds.filter(ad => ad.status === filter)

  const totalSpend = mockAds
    .filter(ad => ad.status === "active")
    .reduce((sum, ad) => sum + parseInt(ad.spend.replace(/[$,]/g, "")), 0)

  const activeCount = mockAds.filter(ad => ad.status === "active").length
  const pausedCount = mockAds.filter(ad => ad.status === "paused").length

  // Reset index when filter changes
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter)
    setCurrentIndex(0)
  }

  // Swipe handling
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe && currentIndex < filteredAds.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
    if (e.key === "ArrowRight" && currentIndex < filteredAds.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header with title, view toggle, and filters */}
      <CampaignHeader 
        activeFilter={filter} 
        onFilterChange={handleFilterChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalAds={mockAds.length}
      />

      {/* Summary stats */}
      <div className="flex gap-2 overflow-x-auto -mx-1 px-1">
        <div className="flex-shrink-0 bg-white rounded-xl px-3 py-2 border border-[#e8e2da]">
          <p className="text-[10px] text-[#6B5D54] uppercase tracking-wide">Active</p>
          <p className="text-lg font-bold text-[#5C9A6E]">{activeCount}</p>
        </div>
        <div className="flex-shrink-0 bg-white rounded-xl px-3 py-2 border border-[#e8e2da]">
          <p className="text-[10px] text-[#6B5D54] uppercase tracking-wide">Paused</p>
          <p className="text-lg font-bold text-[#B8924A]">{pausedCount}</p>
        </div>
        <div className="flex-shrink-0 bg-white rounded-xl px-3 py-2 border border-[#e8e2da]">
          <p className="text-[10px] text-[#6B5D54] uppercase tracking-wide">Spend</p>
          <p className="text-lg font-bold text-[#2C2420]">${totalSpend}</p>
        </div>
        <div className="flex-shrink-0 bg-white rounded-xl px-3 py-2 border border-[#e8e2da]">
          <p className="text-[10px] text-[#6B5D54] uppercase tracking-wide">Drafts</p>
          <p className="text-lg font-bold text-[#9C8D84]">{mockAds.filter(ad => ad.status === "draft").length}</p>
        </div>
      </div>

      {/* Content area with view transition */}
      <div className={`transition-all duration-500 ${viewMode === "carousel" ? "opacity-100" : "opacity-100"}`}>
        {viewMode === "carousel" ? (
          <>
            {/* Carousel view */}
            <div 
              className="relative h-[520px] overflow-hidden"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              role="region"
              aria-label="Ad carousel"
            >
              {/* Navigation arrows */}
              {currentIndex > 0 && (
                <button
                  onClick={() => setCurrentIndex(prev => prev - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-[#6B5D54] hover:text-[#9B7EC8] transition-all hover:scale-110 active:scale-95"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12 15L7 10L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
              {currentIndex < filteredAds.length - 1 && (
                <button
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-[#6B5D54] hover:text-[#9B7EC8] transition-all hover:scale-110 active:scale-95"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M8 5L13 10L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}

              {/* Carousel cards */}
              {filteredAds.map((ad, index) => (
                <CarouselAdCard
                  key={ad.id}
                  ad={ad}
                  isActive={index === currentIndex}
                  offset={index - currentIndex}
                />
              ))}
            </div>

            {/* Carousel dots */}
            <CarouselDots 
              total={filteredAds.length} 
              current={currentIndex} 
              onChange={setCurrentIndex} 
            />
          </>
        ) : (
          /* Grid view */
          <div className="grid grid-cols-2 gap-3 transition-all duration-500">
            {filteredAds.map((ad, index) => (
              <div 
                key={ad.id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
              >
                <AdPreviewCard
                  {...ad}
                  onSelect={() => {
                    setCurrentIndex(index)
                    setViewMode("carousel")
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Empty state */}
      {filteredAds.length === 0 && (
        <div className="text-center py-12 animate-in fade-in duration-300">
          <Target size={48} className="mx-auto text-[#9C8D84] mb-4" />
          <p className="text-[#6B5D54]">No {filter} ads found</p>
        </div>
      )}

      {/* Create new ad options */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-[#6B5D54]">Add New Ad</p>
        
        {/* AI Generate option */}
        <button 
          onClick={onNavigateToCreate}
          className="w-full bg-gradient-to-br from-[#9B7EC8] to-[#8A6DB8] rounded-2xl p-4 hover:scale-[1.02] transition-transform active:scale-[0.98] text-left shadow-lg shadow-[#9B7EC8]/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Sparkles size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white">Create with AI</p>
              <p className="text-sm text-white/80">Generate high-converting ads instantly</p>
            </div>
            <ChevronRight size={20} className="text-white/80" />
          </div>
        </button>

        {/* Upload your own option */}
        <button 
          onClick={() => setShowUploadModal(true)}
          className="w-full bg-white rounded-2xl p-4 border border-[#e8e2da] hover:scale-[1.02] transition-transform active:scale-[0.98] text-left hover:border-[#9B7EC8]/40"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#f5f0e8] flex items-center justify-center flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[#2C2420]">Upload Your Own</p>
              <p className="text-sm text-[#6B5D54]">Add existing creative assets</p>
            </div>
            <ChevronRight size={20} className="text-[#9C8D84]" />
          </div>
        </button>
      </div>

      {/* Upload modal */}
      <UploadModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} />
    </div>
  )
}

// Mini bar chart component for sparklines
function MiniBarChart({ data, color = "#9B7EC8" }: { data: number[]; color?: string }) {
  const max = Math.max(...data)
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((value, i) => (
        <div
          key={i}
          className="w-1.5 rounded-sm transition-all"
          style={{
            height: `${(value / max) * 100}%`,
            backgroundColor: color,
            opacity: 0.4 + (i / data.length) * 0.6
          }}
        />
      ))}
    </div>
  )
}

// Metric card with trend
function MetricCard({ 
  label, 
  value, 
  change, 
  trend,
  prefix = "",
  suffix = ""
}: { 
  label: string
  value: string
  change: string
  trend: number[]
  prefix?: string
  suffix?: string
}) {
  const isPositive = change.startsWith("+")
  return (
    <div className="bg-white rounded-2xl p-4 border border-[#e8e2da]">
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm text-[#6B5D54]">{label}</span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          isPositive ? "bg-[#5C9A6E]/10 text-[#5C9A6E]" : "bg-[#B85C5C]/10 text-[#B85C5C]"
        }`}>
          {change}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-[#2C2420]">
          {prefix}{value}{suffix}
        </p>
        <MiniBarChart data={trend} color={isPositive ? "#5C9A6E" : "#B85C5C"} />
      </div>
    </div>
  )
}

// Platform performance row
function PlatformRow({ 
  platform, 
  icon,
  spend, 
  impressions, 
  clicks, 
  ctr,
  conversions
}: { 
  platform: string
  icon: React.ReactNode
  spend: string
  impressions: string
  clicks: string
  ctr: string
  conversions: string
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[#e8e2da] last:border-0">
      <div className="w-10 h-10 rounded-xl bg-[#f5f0e8] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[#2C2420] text-sm">{platform}</p>
        <p className="text-xs text-[#6B5D54]">{impressions} impressions</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-[#2C2420] text-sm">{spend}</p>
        <p className="text-xs text-[#5C9A6E]">{conversions} conv.</p>
      </div>
    </div>
  )
}

// Campaign performance card
function CampaignPerformanceCard({
  name,
  status,
  spend,
  impressions,
  clicks,
  conversions,
  roas
}: {
  name: string
  status: "active" | "paused" | "ended"
  spend: string
  impressions: string
  clicks: string
  conversions: string
  roas: string
}) {
  const statusColors = {
    active: "bg-[#5C9A6E]/10 text-[#5C9A6E]",
    paused: "bg-[#B8924A]/10 text-[#B8924A]",
    ended: "bg-[#9C8D84]/10 text-[#9C8D84]"
  }

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#e8e2da]">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-2">
          <p className="font-semibold text-[#2C2420] truncate">{name}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize flex-shrink-0 ${statusColors[status]}`}>
          {status}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        <div>
          <p className="text-xs text-[#6B5D54] mb-1">Spend</p>
          <p className="text-sm font-semibold text-[#2C2420]">{spend}</p>
        </div>
        <div>
          <p className="text-xs text-[#6B5D54] mb-1">Impr.</p>
          <p className="text-sm font-semibold text-[#2C2420]">{impressions}</p>
        </div>
        <div>
          <p className="text-xs text-[#6B5D54] mb-1">Clicks</p>
          <p className="text-sm font-semibold text-[#2C2420]">{clicks}</p>
        </div>
        <div>
          <p className="text-xs text-[#6B5D54] mb-1">ROAS</p>
          <p className="text-sm font-semibold text-[#5C9A6E]">{roas}</p>
        </div>
      </div>
    </div>
  )
}

function AnalyticsView({ darkMode = false }: { darkMode?: boolean }) {
  const [timeRange, setTimeRange] = useState("7d")
  
  // Mock data - will be replaced with Meta API data
  const mockTrendData = {
    spend: [120, 145, 130, 180, 210, 195, 240],
    impressions: [4500, 5200, 4800, 6100, 7200, 6800, 8100],
    clicks: [120, 145, 135, 180, 210, 195, 245],
    conversions: [12, 18, 15, 24, 28, 22, 32]
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Time range selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {[
          { id: "24h", label: "24h" },
          { id: "7d", label: "7 days" },
          { id: "30d", label: "30 days" },
          { id: "90d", label: "90 days" }
        ].map((range) => (
          <button
            key={range.id}
            onClick={() => setTimeRange(range.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              timeRange === range.id
                ? "bg-[#9B7EC8] text-white"
                : "bg-white border border-[#e8e2da] text-[#6B5D54]"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Total Spend"
          value="1,420"
          prefix="$"
          change="+12.5%"
          trend={mockTrendData.spend}
        />
        <MetricCard
          label="Impressions"
          value="42.8K"
          change="+24.3%"
          trend={mockTrendData.impressions}
        />
        <MetricCard
          label="Clicks"
          value="1,230"
          change="+18.2%"
          trend={mockTrendData.clicks}
        />
        <MetricCard
          label="Conversions"
          value="151"
          change="+32.1%"
          trend={mockTrendData.conversions}
        />
      </div>

      {/* Performance summary card */}
      <div className="bg-white rounded-2xl p-4 border border-[#e8e2da]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#2C2420]">Performance Summary</h3>
          <span className="text-xs text-[#6B5D54] bg-[#f5f0e8] px-2 py-1 rounded-full">Last {timeRange === "24h" ? "24 hours" : timeRange === "7d" ? "7 days" : timeRange === "30d" ? "30 days" : "90 days"}</span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-[#2C2420]">2.87%</p>
            <p className="text-xs text-[#6B5D54]">Avg. CTR</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#2C2420]">$1.15</p>
            <p className="text-xs text-[#6B5D54]">Avg. CPC</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#5C9A6E]">3.2x</p>
            <p className="text-xs text-[#6B5D54]">ROAS</p>
          </div>
        </div>
      </div>

      {/* Platform breakdown */}
      <div className="bg-white rounded-2xl p-4 border border-[#e8e2da]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-[#2C2420]">By Platform</h3>
          <button className="text-sm text-[#9B7EC8] font-medium">Details</button>
        </div>
        <div className="space-y-0">
          <PlatformRow
            platform="Meta (Facebook/Instagram)"
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" fill="#1877F2"/>
                <path d="M13 10.5h-2v5h-2v-5H7.5V9H9V7.5c0-1.4.9-2.5 2.5-2.5h1.5v1.5h-1c-.5 0-.5.2-.5.5V9h1.5l-.5 1.5z" fill="white"/>
              </svg>
            }
            spend="$820"
            impressions="28.4K"
            clicks="812"
            ctr="2.86%"
            conversions="98"
          />
          <PlatformRow
            platform="Google Ads"
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" fill="#4285F4"/>
                <path d="M6 14l4-8 4 8H6z" fill="white"/>
              </svg>
            }
            spend="$420"
            impressions="10.2K"
            clicks="298"
            ctr="2.92%"
            conversions="38"
          />
          <PlatformRow
            platform="TikTok Ads"
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" fill="#000"/>
                <path d="M12 6.5v7c0 1.4-1.1 2.5-2.5 2.5S7 14.9 7 13.5 8.1 11 9.5 11c.2 0 .3 0 .5.1V8.5c-.2 0-.3-.1-.5-.1C7 8.4 5 10.4 5 13s2 4.5 4.5 4.5S14 15.6 14 13V9.5c.7.5 1.6.8 2.5.8v-2c-1.4 0-2.5-1.1-2.5-2.5V6H12v.5z" fill="white"/>
              </svg>
            }
            spend="$180"
            impressions="4.2K"
            clicks="120"
            ctr="2.86%"
            conversions="15"
          />
        </div>
      </div>

      {/* Top campaigns */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-[#2C2420]">Top Campaigns</h3>
          <button className="text-sm text-[#9B7EC8] font-medium flex items-center gap-1">
            View all <ArrowRight size={14} />
          </button>
        </div>
        <div className="space-y-3">
          <CampaignPerformanceCard
            name="Summer Sale - 50% Off"
            status="active"
            spend="$420"
            impressions="12.4K"
            clicks="356"
            conversions="42"
            roas="4.2x"
          />
          <CampaignPerformanceCard
            name="New Product Launch"
            status="active"
            spend="$280"
            impressions="8.2K"
            clicks="245"
            conversions="28"
            roas="3.8x"
          />
          <CampaignPerformanceCard
            name="Holiday Promo 2025"
            status="paused"
            spend="$180"
            impressions="5.1K"
            clicks="148"
            conversions="18"
            roas="2.9x"
          />
        </div>
      </div>

      {/* Connect more platforms CTA */}
      <div className="bg-gradient-to-br from-[#9B7EC8]/10 to-[#8A6DB8]/10 rounded-2xl p-4 border border-[#9B7EC8]/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#9B7EC8] flex items-center justify-center flex-shrink-0">
            <Plus size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[#2C2420] mb-1">Connect More Platforms</p>
            <p className="text-sm text-[#6B5D54] mb-3">Get a complete view of your ad performance across all channels.</p>
            <button className="text-sm font-medium text-[#9B7EC8]">
              Add Integration
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Settings row component
function SettingsRow({ 
  icon, 
  label, 
  value, 
  onClick,
  danger = false,
  showArrow = true
}: { 
  icon: React.ReactNode
  label: string
  value?: string
  onClick?: () => void
  danger?: boolean
  showArrow?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[#f5f0e8]/50 transition-colors text-left"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${danger ? "bg-red-50" : "bg-[#f5f0e8]"}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${danger ? "text-red-600" : "text-[#2C2420]"}`}>{label}</p>
      </div>
      {value && <span className="text-sm text-[#9C8D84]">{value}</span>}
      {showArrow && <ChevronRight size={18} className={danger ? "text-red-400" : "text-[#9C8D84]"} />}
    </button>
  )
}

// Toggle switch component
function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (val: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`w-12 h-7 rounded-full transition-colors relative ${enabled ? "bg-[#9B7EC8]" : "bg-[#e8e2da]"}`}
    >
      <div 
        className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  )
}

function SettingsView({ darkMode, onDarkModeChange, onLogout }: { darkMode: boolean; onDarkModeChange: (val: boolean) => void; onLogout: () => void }) {
  const { language, setLanguage, t, adLanguage, setAdLanguage } = useLanguage()
  const [pushNotifications, setPushNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteInput, setDeleteInput] = useState("")
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const [showAdLanguageModal, setShowAdLanguageModal] = useState(false)

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-8">
      {/* Profile section */}
      <div className="bg-white rounded-2xl border border-[#e8e2da] overflow-hidden">
        <div className="p-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9B7EC8] to-[#8A6DB8] flex items-center justify-center">
            <span className="text-2xl font-bold text-white">JD</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#2C2420] text-lg">John Doe</h3>
            <p className="text-sm text-[#6B5D54]">john@example.com</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-[#9B7EC8]/10 text-[#9B7EC8] text-xs font-medium rounded-full">Pro Plan</span>
          </div>
          <button className="p-2 text-[#9B7EC8]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Account section */}
      <div>
        <p className="text-xs font-semibold text-[#9C8D84] uppercase tracking-wider px-1 mb-2">Account</p>
        <div className="bg-white rounded-2xl border border-[#e8e2da] overflow-hidden divide-y divide-[#e8e2da]">
          <SettingsRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            label="Edit Profile"
          />
          <SettingsRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
            label="Change Password"
          />
          <SettingsRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            label="Email"
            value="john@example.com"
          />
          <SettingsRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            label="Phone Number"
            value="Add"
          />
        </div>
      </div>

      {/* Billing section */}
      <div>
        <p className="text-xs font-semibold text-[#9C8D84] uppercase tracking-wider px-1 mb-2">Billing & Plan</p>
        <div className="bg-white rounded-2xl border border-[#e8e2da] overflow-hidden divide-y divide-[#e8e2da]">
          <SettingsRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]"><rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M1 10h22" stroke="currentColor" strokeWidth="2"/></svg>}
            label="Payment Methods"
            value="Visa •••• 4242"
          />
          <SettingsRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            label="Subscription"
            value="Pro Plan"
          />
          <SettingsRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            label="Billing History"
          />
        </div>
      </div>

      {/* Notifications section */}
      <div>
        <p className="text-xs font-semibold text-[#9C8D84] uppercase tracking-wider px-1 mb-2">Notifications</p>
        <div className="bg-white rounded-2xl border border-[#e8e2da] overflow-hidden divide-y divide-[#e8e2da]">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#f5f0e8] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-[#2C2420]">Push Notifications</p>
              <p className="text-xs text-[#9C8D84]">Receive alerts on your device</p>
            </div>
            <ToggleSwitch enabled={pushNotifications} onChange={setPushNotifications} />
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#f5f0e8] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-[#2C2420]">Email Notifications</p>
              <p className="text-xs text-[#9C8D84]">Campaign updates and reports</p>
            </div>
            <ToggleSwitch enabled={emailNotifications} onChange={setEmailNotifications} />
          </div>
        </div>
      </div>

      {/* Preferences section */}
      <div>
        <p className="text-xs font-semibold text-[#9C8D84] uppercase tracking-wider px-1 mb-2">Preferences</p>
        <div className="bg-white rounded-2xl border border-[#e8e2da] overflow-hidden divide-y divide-[#e8e2da]">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#f5f0e8] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-[#2C2420]">Dark Mode</p>
              <p className="text-xs text-[#9C8D84]">Switch to dark theme</p>
            </div>
            <ToggleSwitch enabled={darkMode} onChange={onDarkModeChange} />
          </div>
          <SettingsRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="2"/></svg>}
            label={t("language")}
            value={languageNames[language]}
            onClick={() => setShowLanguageModal(true)}
          />
          <SettingsRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]"><path d="M5 8l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 4h16M4 12h16M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
            label={t("adLanguage")}
            value={languageNames[adLanguage]}
            onClick={() => setShowAdLanguageModal(true)}
          />
          <SettingsRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            label="Timezone"
            value="PST"
          />
        </div>
      </div>

      {/* Integrations section */}
      <div>
        <p className="text-xs font-semibold text-[#9C8D84] uppercase tracking-wider px-1 mb-2">Connected Accounts</p>
        <div className="bg-white rounded-2xl border border-[#e8e2da] overflow-hidden divide-y divide-[#e8e2da]">
          <SettingsRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#1877F2"/><path d="M15.5 12.5h-2v4h-2v-4h-1.5v-1.5h1.5v-1c0-1.2.8-2 2-2h1.5v1.5h-1c-.3 0-.5.2-.5.5v1h1.5l-.5 1.5z" fill="white"/></svg>}
            label="Meta Business"
            value="Connected"
          />
          <SettingsRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#4285F4"/><path d="M12 7c1.5 0 2.7.5 3.6 1.3l-1.5 1.4c-.5-.5-1.3-.8-2.1-.8-1.8 0-3.3 1.5-3.3 3.3s1.5 3.3 3.3 3.3c1.5 0 2.8-.9 3.1-2H12v-1.7h5.3c.1.4.1.8.1 1.2 0 2.9-2 5-5.3 5-3 0-5.5-2.5-5.5-5.5S9 6.5 12 6.5" fill="white"/></svg>}
            label="Google Ads"
            value="Connect"
          />
          <SettingsRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="black"/><path d="M16 8v6c0 2-1.5 3.5-3.5 3.5S9 16 9 14s1.5-3.5 3.5-3.5v2c-1 0-1.5.7-1.5 1.5s.5 1.5 1.5 1.5 1.5-.7 1.5-1.5V6h2c0 1.7 1.3 3 3 3v2c-.8 0-1.6-.2-2.5-.6" fill="white"/></svg>}
            label="TikTok Ads"
            value="Connect"
          />
        </div>
      </div>

      {/* Support section */}
      <div>
        <p className="text-xs font-semibold text-[#9C8D84] uppercase tracking-wider px-1 mb-2">Support</p>
        <div className="bg-white rounded-2xl border border-[#e8e2da] overflow-hidden divide-y divide-[#e8e2da]">
          <SettingsRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            label="Help Center"
          />
          <SettingsRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            label="Contact Support"
          />
          <SettingsRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            label="Terms of Service"
          />
          <SettingsRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
            label="Privacy Policy"
          />
        </div>
      </div>

      {/* Danger zone */}
      <div>
        <p className="text-xs font-semibold text-[#9C8D84] uppercase tracking-wider px-1 mb-2">Account Actions</p>
        <div className="bg-white rounded-2xl border border-[#e8e2da] overflow-hidden divide-y divide-[#e8e2da]">
          <SettingsRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-red-500"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            label="Log Out"
            danger
            onClick={() => setShowLogoutConfirm(true)}
          />
          <SettingsRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-red-500"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            label="Delete Account"
            danger
            onClick={() => setShowDeleteConfirm(true)}
          />
        </div>
      </div>

      {/* App version */}
      <p className="text-center text-xs text-[#9C8D84] pt-4">
        Flare v1.0.0
      </p>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold text-[#2C2420] mb-2">Log Out?</h3>
            <p className="text-sm text-[#6B5D54] mb-6">Are you sure you want to log out of your account?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-xl font-medium border border-[#e8e2da] text-[#6B5D54] active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowLogoutConfirm(false)
                  onLogout()
                }}
                className="flex-1 py-3 rounded-xl font-medium bg-red-500 text-white active:scale-95 transition-transform"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete account confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-red-500">
                <path d="M12 9v4M12 17h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#2C2420] mb-2 text-center">Delete Account?</h3>
            <p className="text-sm text-[#6B5D54] mb-4 text-center">
              This action <span className="font-semibold text-red-500">cannot be undone</span>. All your data, campaigns, and settings will be permanently deleted.
            </p>
  <p className="text-sm text-[#6B5D54] mb-2">
  {t("typeDelete")} <span className="font-mono font-semibold text-red-500">{deleteWords[language]}</span> {t("toConfirm")}
  </p>
  <input
  type="text"
  value={deleteInput}
  onChange={(e) => setDeleteInput(e.target.value)}
  placeholder={t("typeDeleteHere")}
              className="w-full px-4 py-3 border border-[#e8e2da] rounded-xl text-[#2C2420] placeholder-[#9C8D84] focus:border-red-300 focus:ring-1 focus:ring-red-300 outline-none transition-colors mb-4"
            />
            <div className="flex gap-3">
  <button
  onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}
  className="flex-1 py-3 rounded-xl font-medium border border-[#e8e2da] text-[#6B5D54] active:scale-95 transition-transform"
  >
  {t("cancel")}
              </button>
              <button 
                onClick={() => {
                  if (deleteInput.toLowerCase() === deleteWords[language]) {
                    setShowDeleteConfirm(false)
                    setDeleteInput("")
                    onLogout()
                  }
                }}
                disabled={deleteInput.toLowerCase() !== deleteWords[language]}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  deleteInput.toLowerCase() === deleteWords[language]
                    ? "bg-red-500 text-white active:scale-95"
                    : "bg-[#e8e2da] text-[#9C8D84] cursor-not-allowed"
                }`}
              >
                {t("deleteAccount")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Language selector modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLanguageModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="p-4 border-b border-[#e8e2da] flex items-center justify-between">
              <h3 className="font-semibold text-[#2C2420]">{t("language")}</h3>
              <button onClick={() => setShowLanguageModal(false)} className="p-2 text-[#6B5D54]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="p-2 max-h-[60vh] overflow-y-auto">
              {(Object.keys(languageNames) as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang); setShowLanguageModal(false); }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                    language === lang ? "bg-[#9B7EC8]/10" : "hover:bg-[#f5f0e8]"
                  }`}
                >
                  <span className={`font-medium ${language === lang ? "text-[#9B7EC8]" : "text-[#2C2420]"}`}>
                    {languageNames[lang]}
                  </span>
                  {language === lang && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
            <div className="p-4 pb-safe" />
          </div>
        </div>
      )}

      {/* Ad Language selector modal */}
      {showAdLanguageModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAdLanguageModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="p-4 border-b border-[#e8e2da]">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#2C2420]">{t("adLanguage")}</h3>
                <button onClick={() => setShowAdLanguageModal(false)} className="p-2 text-[#6B5D54]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <p className="text-sm text-[#6B5D54] mt-1">{t("selectAdLanguage")}</p>
            </div>
            <div className="p-2 max-h-[60vh] overflow-y-auto">
              {(Object.keys(languageNames) as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setAdLanguage(lang); setShowAdLanguageModal(false); }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                    adLanguage === lang ? "bg-[#9B7EC8]/10" : "hover:bg-[#f5f0e8]"
                  }`}
                >
                  <span className={`font-medium ${adLanguage === lang ? "text-[#9B7EC8]" : "text-[#2C2420]"}`}>
                    {languageNames[lang]}
                  </span>
                  {adLanguage === lang && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#9B7EC8]">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
            <div className="p-4 pb-safe" />
          </div>
        </div>
      )}
    </div>
  )
}

// Logged out / Welcome screen
function WelcomeScreen({ onLogin }: { onLogin: () => void }) {
  const { t } = useLanguage()
  return (
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <FlareLogo size={80} showWordmark />
        <p className="text-[#6B5D54] text-center mt-4 mb-8 max-w-xs">
          {t("welcomeDesc")}
        </p>
        <button
          onClick={onLogin}
          className="w-full max-w-xs py-4 rounded-2xl bg-gradient-to-br from-[#9B7EC8] to-[#8A6DB8] text-white font-semibold shadow-lg shadow-[#9B7EC8]/30 active:scale-95 transition-transform"
        >
          {t("getStarted")}
        </button>
        <button
          onClick={onLogin}
          className="mt-4 text-[#9B7EC8] font-medium"
        >
          {t("haveAccount")}
        </button>
      </div>
      <p className="text-center text-xs text-[#9C8D84] pb-8">
        {t("termsAgree")}
      </p>
    </div>
  )
}

export default function FlareApp() {
  const [activeTab, setActiveTab] = useState("home")
  const [darkMode, setDarkMode] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [language, setLanguage] = useState<Language>("en")
  const [adLanguage, setAdLanguage] = useState<Language>("en")

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key] || key
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setActiveTab("home")
    setDarkMode(false)
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const languageValue = { language, t, setLanguage, adLanguage, setAdLanguage }

  if (!isLoggedIn) {
    return (
      <LanguageContext.Provider value={languageValue}>
        <WelcomeScreen onLogin={handleLogin} />
      </LanguageContext.Provider>
    )
  }

  const renderView = () => {
    switch (activeTab) {
      case "home":
        return <DashboardView onNavigateToCreate={() => setActiveTab("create")} onNavigateToCampaigns={() => setActiveTab("campaigns")} darkMode={darkMode} />
      case "campaigns":
        return <CampaignsView onNavigateToCreate={() => setActiveTab("create")} darkMode={darkMode} />
      case "create":
        return <CreateView darkMode={darkMode} />
      case "analytics":
        return <AnalyticsView darkMode={darkMode} />
      case "settings":
        return <SettingsView darkMode={darkMode} onDarkModeChange={setDarkMode} onLogout={handleLogout} />
      default:
        return <DashboardView onNavigateToCreate={() => setActiveTab("create")} onNavigateToCampaigns={() => setActiveTab("campaigns")} darkMode={darkMode} />
    }
  }

  const tabLabels: Record<string, keyof typeof translations.en> = {
    home: "home",
    campaigns: "campaigns",
    create: "create",
    analytics: "analytics",
    settings: "settings"
  }

  return (
    <LanguageContext.Provider value={languageValue}>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-[#1a1a1a]" : "bg-[#f5f0e8]"}`}>
        {/* Header */}
        <header className={`sticky top-0 z-40 backdrop-blur-sm border-b pt-safe transition-colors duration-300 ${
          darkMode 
            ? "bg-[#1a1a1a]/95 border-[#2a2a2a]" 
            : "bg-[#f5f0e8]/95 border-[#e8e2da]"
        }`}>
          <div className="flex items-center justify-between px-4 py-3">
            <FlareLogo size={40} showWordmark={false} />
            <h1 className={`text-lg font-bold transition-colors duration-300 ${darkMode ? "text-white" : "text-[#2C2420]"}`}>
              {t(tabLabels[activeTab] || "home")}
            </h1>
            <button className={`w-10 h-10 rounded-full border flex items-center justify-center active:scale-95 transition-all duration-300 ${
              darkMode 
                ? "bg-[#2a2a2a] border-[#3a3a3a]" 
                : "bg-white border-[#e8e2da]"
            }`}>
              <Bell size={20} className={darkMode ? "text-[#a0a0a0]" : "text-[#6B5D54]"} />
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="px-4 py-6 pb-24">
          {renderView()}
        </main>

        {/* Bottom tab bar */}
        <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} darkMode={darkMode} />
      </div>
    </LanguageContext.Provider>
  )
}
