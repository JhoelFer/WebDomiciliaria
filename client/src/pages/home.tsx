import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  Monitor, 
  Smartphone, 
  Globe, 
  CheckCircle2, 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin,
  Code2,
  Layout,
  Calendar,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import heroImage from "@assets/generated_images/modern_minimalist_workspace_with_soft_celeste_lighting.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
      <Navbar />
      <Hero />
      <Services />
      <About />
      <WhyChooseMe />
      <Contact />
      <Footer />
    </div>
  );
}

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setIsScrolled(window.scrollY > 20);
    });
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 font-heading font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <Code2 size={20} />
          </div>
          <span>WebDomicilio</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#services" className="hover:text-primary transition-colors">Servicios</a>
          <a href="#about" className="hover:text-primary transition-colors">Sobre Mí</a>
          <a href="#why-me" className="hover:text-primary transition-colors">Beneficios</a>
        </div>
        <Button className="rounded-full px-6 font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
          <a href="#contact">Contáctame</a>
        </Button>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-bl from-accent/50 to-transparent blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 -z-10 w-1/3 h-full bg-gradient-to-tr from-primary/10 to-transparent blur-3xl opacity-60" />
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Disponible para visitas a domicilio
            </div>
            
            <h1 className="font-heading text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-slate-900">
              Diseño Web <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-600">
                Profesional
              </span>
              <br /> a Tu Puerta.
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Transformo tu idea en una presencia digital moderna y efectiva. 
              Servicio personalizado, minimalista y sin tecnicismos complicados.
              Yo voy a ti, te escucho y lo construimos juntos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="text-base px-8 h-12 rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300">
                Agendar Consulta Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="text-base px-8 h-12 rounded-full border-2 hover:bg-accent/50">
                Ver Portafolio
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-8 border-t border-border/50">
              <div className="flex flex-col">
                <span className="font-bold text-2xl font-heading">100%</span>
                <span className="text-sm text-muted-foreground">Satisfacción</span>
              </div>
              <div className="w-px h-10 bg-border/50" />
              <div className="flex flex-col">
                <span className="font-bold text-2xl font-heading">Rápido</span>
                <span className="text-sm text-muted-foreground">Entrega ágil</span>
              </div>
              <div className="w-px h-10 bg-border/50" />
              <div className="flex flex-col">
                <span className="font-bold text-2xl font-heading">Soporte</span>
                <span className="text-sm text-muted-foreground">Personalizado</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border/50 bg-white aspect-[4/3] group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
              <img 
                src={heroImage} 
                alt="Espacio de trabajo moderno y minimalista" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Floating Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 z-20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">index.html</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-3/4 bg-slate-200 rounded-full" />
                  <div className="h-2 w-1/2 bg-slate-200 rounded-full" />
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-sky-400/10 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    {
      icon: <Monitor className="h-6 w-6 text-primary" />,
      title: "Landing Pages Especializadas",
      description: "Páginas de aterrizaje diseñadas para convertir visitantes en clientes. Ideales para promociones o productos específicos."
    },
    {
      icon: <Smartphone className="h-6 w-6 text-primary" />,
      title: "Sitios Informativos",
      description: "Presenta tu negocio al mundo con una web profesional, rápida y segura. Sin complicaciones de bases de datos."
    },
    {
      icon: <Globe className="h-6 w-6 text-primary" />,
      title: "Portafolios y Catálogos",
      description: "Muestra tu trabajo o productos con una galería elegante y moderna. Perfecto para profesionales y creativos."
    }
  ];

  return (
    <section id="services" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-slate-900">Webs Estáticas de Alto Impacto</h2>
          <p className="text-muted-foreground">
            Me especializo en crear sitios web rápidos, seguros y sin mantenimiento complejo. 
            Olvídate de las bases de datos y los errores de servidor.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-none shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center mb-4">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-primary rounded-3xl rotate-3 opacity-10"></div>
              <div className="bg-slate-900 text-white p-10 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <Code2 className="w-12 h-12 text-primary mb-6" />
                <h3 className="text-2xl font-heading font-bold mb-4">Hola, soy Jhoel Fernando Albornoz</h3>
                <p className="text-slate-300 leading-relaxed mb-6">
                  Soy Técnico Superior en Desarrollo de Software en formación, enfocado exclusivamente en el desarrollo frontend y diseño web.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  Me dedico a crear experiencias web puras, sin la complejidad de bases de datos. Esto garantiza sitios más rápidos, seguros y económicos de mantener. Mi compromiso es entregarte una web que funcione perfecta desde el primer día.
                </p>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 space-y-6">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900">
              Diseño web puro, <br />
              <span className="text-primary">sin complicaciones.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Mi objetivo es llevar tu negocio al mundo digital de la forma más eficiente posible. Me especializo en sitios informativos y landing pages que no requieren gestión de bases de datos.
            </p>
            
            <div className="space-y-4 pt-4">
              {[
                "Sitios Web Informativos y Rápidos",
                "Diseño Moderno y Responsivo",
                "Sin Mantenimiento de Bases de Datos",
                "Atención Personalizada a Domicilio"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-6">
              <Button className="rounded-full px-8">
                <a href="#contact">Agendar Visita</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChooseMe() {
  return (
    <section id="why-me" className="py-20 bg-slate-900 text-white overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)", backgroundSize: "32px 32px" }}>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">¿Por qué elegir mi servicio?</h2>
          <p className="text-slate-400">
            La diferencia está en el detalle y en la cercanía.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Layout, title: "Diseño Exclusivo", desc: "Cada proyecto es único y adaptado a tu marca." },
            { icon: MapPin, title: "Servicio a Domicilio", desc: "Voy a donde estés para planificar tu proyecto." },
            { icon: Phone, title: "Contacto Directo", desc: "Sin tickets de soporte eternos. Me llamas y resuelvo." },
            { icon: CheckCircle2, title: "Garantía de Calidad", desc: "No entrego hasta que estés 100% satisfecho." }
          ].map((item, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
              <item.icon className="w-10 h-10 text-primary mb-4" />
              <h4 className="font-bold text-lg mb-2">{item.title}</h4>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: bookedSlots = [] } = useQuery({
    queryKey: ["bookedSlots", formData.date],
    queryFn: async () => {
      if (!formData.date) return [];
      const res = await fetch(`/api/appointments/booked-slots?date=${formData.date}`);
      return res.json();
    },
    enabled: !!formData.date,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const text = `Hola Jhoel, soy ${formData.name}. Me gustaría agendar una visita para el día ${formData.date} a las ${formData.time}. 
    
Mi teléfono es: ${formData.phone}
Detalles: ${formData.message}`;

        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/5493814468379?text=${encodedText}`, '_blank');
        
        setFormData({ name: "", phone: "", date: "", time: "", message: "" });
      } else {
        alert("Error al guardar la solicitud. Intenta de nuevo.");
      }
    } catch (error) {
      alert("Error al guardar la solicitud. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableHours = [
    "09:00", "10:00", "11:00", "12:00",
    "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  const isSlotBooked = (time: string) => bookedSlots.includes(time);

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-border">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/5 bg-primary p-10 text-white flex flex-col justify-between">
              <div>
                <h3 className="font-heading text-2xl font-bold mb-4">Agenda tu Visita</h3>
                <p className="text-primary-foreground/80 mb-8">
                  Selecciona tu horario preferido. La confirmación final de la visita se realizará directamente por WhatsApp.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs opacity-70">WhatsApp Directo</p>
                      <p className="font-medium">+54 9 381 446 8379</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                    <p className="font-bold text-sm mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Horarios Disponibles
                    </p>
                    <ul className="space-y-1 text-sm opacity-90">
                      <li className="flex justify-between">
                        <span>Lunes - Viernes:</span>
                        <span className="font-medium">9:00 - 18:00</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Sábados:</span>
                        <span className="font-medium">9:00 - 13:00</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs opacity-70">Zona de Cobertura</p>
                      <p className="font-medium">Tucumán, Argentina</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            
            <div className="md:w-3/5 p-8 md:p-12">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input 
                      id="name" 
                      placeholder="Tu nombre" 
                      className="bg-slate-50 border-slate-200"
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono (WhatsApp)</Label>
                    <Input 
                      id="phone" 
                      placeholder="+54 9..." 
                      className="bg-slate-50 border-slate-200"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha Preferida</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      className="bg-slate-50 border-slate-200"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Hora Preferida</Label>
                    {!formData.date ? (
                      <div className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-muted-foreground items-center">
                        Selecciona una fecha primero
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {availableHours.map((hour) => (
                          <button
                            key={hour}
                            type="button"
                            onClick={() => setFormData({...formData, time: hour})}
                            disabled={isSlotBooked(hour)}
                            className={`py-2 px-2 rounded-md text-xs font-medium transition-all ${
                              isSlotBooked(hour)
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed line-through"
                                : formData.time === hour
                                  ? "bg-primary text-white"
                                  : "border border-slate-200 bg-white hover:border-primary"
                            }`}
                          >
                            {hour}
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="text-[10px] text-muted-foreground">Gris: horario ocupado | Confirmación por WhatsApp</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Detalles adicionales (Opcional)</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Dirección del local, tipo de negocio, o consulta específica..." 
                    className="bg-slate-50 border-slate-200 min-h-[80px]"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full rounded-lg h-12 text-base font-medium shadow-lg shadow-green-500/20 hover:shadow-green-500/30 hover:bg-green-600 bg-green-500 transition-all"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  {isSubmitting ? "Guardando..." : "Confirmar Solicitud por WhatsApp"}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Al hacer clic, se abrirá WhatsApp para enviar los detalles de tu cita.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-border py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 font-heading font-bold text-lg text-slate-900">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white text-xs">
            <Code2 size={14} />
          </div>
          <span>WebDomicilio</span>
        </div>
        
        <div className="text-sm text-muted-foreground text-center md:text-right">
          <p>© 2025 Jhoel Fernando Albornoz. Todos los derechos reservados.</p>
          <p className="mt-1">Diseñado con pasión y minimalismo.</p>
        </div>
      </div>
    </footer>
  );
}
