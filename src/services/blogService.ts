
import { BlogPost } from "@/types/blog";
import { generateTranslations } from "./translationService";

// Get blog posts from localStorage or use default ones if none exist
const getStoredBlogPosts = (): BlogPost[] => {
  const storedPosts = localStorage.getItem('blogPosts');
  if (storedPosts) {
    return JSON.parse(storedPosts);
  }

  // Default blog posts as fallback
  return [
    {
      id: "1",
      title: "Leveraging AI for Small Business Growth",
      slug: "leveraging-ai-for-small-business-growth",
      excerpt: "Discover how small businesses can harness the power of AI to automate processes, enhance customer experience, and drive growth without breaking the bank.",
      content: "<p>Small businesses face unique challenges when it comes to staying competitive in today's digital landscape. With limited resources and manpower, it can be difficult to keep up with larger competitors who have the means to invest heavily in technology and innovation.</p><p>Artificial Intelligence (AI) is leveling the playing field by providing small businesses with affordable and accessible tools to automate tasks, gain valuable insights, and enhance customer experiences. Here's how small businesses can leverage AI to drive growth:</p><h2>1. Customer Service Automation</h2><p>AI-powered chatbots can handle customer inquiries 24/7, freeing up your team to focus on more complex tasks. These virtual assistants can answer frequently asked questions, guide customers through the purchasing process, and even handle basic troubleshooting.</p><h2>2. Marketing Optimization</h2><p>AI tools can analyze customer data to identify patterns and preferences, allowing you to create more targeted and effective marketing campaigns. From personalized email marketing to social media content creation, AI can help you reach the right audience with the right message at the right time.</p><h2>3. Process Automation</h2><p>Repetitive tasks like data entry, invoice processing, and appointment scheduling can be automated using AI, saving your team valuable time and reducing the risk of human error. This not only increases efficiency but also allows your employees to focus on high-value activities that require human creativity and decision-making.</p><h2>4. Predictive Analytics</h2><p>AI can analyze historical data to identify trends and make predictions about future market conditions, customer behavior, and business performance. This enables small businesses to make more informed decisions about inventory management, pricing strategies, and resource allocation.</p><p>By embracing AI technologies, small businesses can operate more efficiently, deliver better customer experiences, and ultimately drive growth without the need for significant capital investment. The key is to start small, focus on solving specific business challenges, and gradually expand your AI capabilities as your business grows.</p>",
      image: "https://images.unsplash.com/photo-1677442135136-760c813028c6?auto=format&fit=crop&q=80&w=800&h=500",
      category: "Business",
      tags: ["AI", "Small Business", "Automation", "Growth"],
      date: "2023-04-15",
      readTime: "5 min read",
      author: "Sarah Johnson",
      featured: true,
      translations: {
        fr: {
          title: "Exploiter l'IA pour la croissance des petites entreprises",
          excerpt: "Découvrez comment les petites entreprises peuvent exploiter la puissance de l'IA pour automatiser les processus, améliorer l'expérience client et stimuler la croissance sans se ruiner.",
          content: "<p>Les petites entreprises font face à des défis uniques lorsqu'il s'agit de rester compétitives dans le paysage numérique actuel. Avec des ressources et une main-d'œuvre limitées, il peut être difficile de suivre le rythme de concurrents plus importants qui ont les moyens d'investir massivement dans la technologie et l'innovation.</p><p>L'Intelligence Artificielle (IA) nivelle les règles du jeu en fournissant aux petites entreprises des outils abordables et accessibles pour automatiser les tâches, obtenir des informations précieuses et améliorer l'expérience client. Voici comment les petites entreprises peuvent tirer parti de l'IA pour stimuler leur croissance :</p><h2>1. Automatisation du service client</h2><p>Les chatbots alimentés par l'IA peuvent gérer les demandes des clients 24h/24 et 7j/7, libérant votre équipe pour se concentrer sur des tâches plus complexes. Ces assistants virtuels peuvent répondre aux questions fréquemment posées, guider les clients tout au long du processus d'achat et même gérer le dépannage de base.</p><h2>2. Optimisation du marketing</h2><p>Les outils d'IA peuvent analyser les données clients pour identifier les modèles et les préférences, vous permettant de créer des campagnes marketing plus ciblées et efficaces. De la personnalisation des emails marketing à la création de contenu pour les médias sociaux, l'IA peut vous aider à atteindre le bon public avec le bon message au bon moment.</p><h2>3. Automatisation des processus</h2><p>Les tâches répétitives comme la saisie de données, le traitement des factures et la planification des rendez-vous peuvent être automatisées à l'aide de l'IA, ce qui permet à votre équipe de gagner un temps précieux et de réduire le risque d'erreur humaine. Cela augmente non seulement l'efficacité, mais permet également à vos employés de se concentrer sur des activités à forte valeur ajoutée qui nécessitent de la créativité humaine et de la prise de décision.</p><h2>4. Analyse prédictive</h2><p>L'IA peut analyser les données historiques pour identifier les tendances et faire des prédictions sur les conditions futures du marché, le comportement des clients et les performances commerciales. Cela permet aux petites entreprises de prendre des décisions plus éclairées concernant la gestion des stocks, les stratégies de prix et l'allocation des ressources.</p><p>En adoptant les technologies d'IA, les petites entreprises peuvent fonctionner plus efficacement, offrir de meilleures expériences client et finalement stimuler la croissance sans avoir besoin d'investissements en capital importants. La clé est de commencer petit, de se concentrer sur la résolution de défis commerciaux spécifiques et d'étendre progressivement vos capacités d'IA à mesure que votre entreprise se développe.</p>"
        },
        es: {
          title: "Aprovechando la IA para el crecimiento de pequeñas empresas",
          excerpt: "Descubra cómo las pequeñas empresas pueden aprovechar el poder de la IA para automatizar procesos, mejorar la experiencia del cliente e impulsar el crecimiento sin gastar mucho.",
          content: "<p>Las pequeñas empresas enfrentan desafíos únicos cuando se trata de mantenerse competitivas en el panorama digital actual. Con recursos y personal limitados, puede ser difícil mantenerse al día con competidores más grandes que tienen los medios para invertir fuertemente en tecnología e innovación.</p><p>La Inteligencia Artificial (IA) está nivelando el campo de juego al proporcionar a las pequeñas empresas herramientas asequibles y accesibles para automatizar tareas, obtener información valiosa y mejorar las experiencias de los clientes. Aquí es cómo las pequeñas empresas pueden aprovechar la IA para impulsar el crecimiento:</p><h2>1. Automatización del servicio al cliente</h2><p>Los chatbots impulsados por IA pueden manejar consultas de clientes 24/7, liberando a su equipo para centrarse en tareas más complejas. Estos asistentes virtuales pueden responder preguntas frecuentes, guiar a los clientes a través del proceso de compra, e incluso manejar solución de problemas básicos.</p><h2>2. Optimización de marketing</h2><p>Las herramientas de IA pueden analizar datos de clientes para identificar patrones y preferencias, permitiéndole crear campañas de marketing más específicas y efectivas. Desde marketing por correo electrónico personalizado hasta creación de contenido para redes sociales, la IA puede ayudarle a llegar al público adecuado con el mensaje adecuado en el momento adecuado.</p><h2>3. Automatización de procesos</h2><p>Tareas repetitivas como entrada de datos, procesamiento de facturas y programación de citas pueden automatizarse usando IA, ahorrando a su equipo tiempo valioso y reduciendo el riesgo de error humano. Esto no solo aumenta la eficiencia sino que también permite a sus empleados centrarse en actividades de alto valor que requieren creatividad humana y toma de decisiones.</p><h2>4. Análisis predictivo</h2><p>La IA puede analizar datos históricos para identificar tendencias y hacer predicciones sobre condiciones futuras del mercado, comportamiento del cliente y rendimiento del negocio. Esto permite a las pequeñas empresas tomar decisiones más informadas sobre gestión de inventario, estrategias de precios y asignación de recursos.</p><p>Al adoptar tecnologías de IA, las pequeñas empresas pueden operar más eficientemente, ofrecer mejores experiencias al cliente y, en última instancia, impulsar el crecimiento sin necesidad de una inversión de capital significativa. La clave es comenzar poco a poco, centrarse en resolver desafíos empresariales específicos y ampliar gradualmente sus capacidades de IA a medida que su negocio crece.</p>"
        }
      }
    },
    {
      id: "2",
      title: "The Future of Workflow Automation",
      slug: "the-future-of-workflow-automation",
      excerpt: "Explore how advanced workflow automation is transforming business operations across industries and what this means for the future of work.",
      content: "<p>Workflow automation has come a long way from simple rule-based systems to sophisticated platforms powered by artificial intelligence and machine learning. As businesses continue to digitize their operations, the role of workflow automation is becoming increasingly central to organizational success.</p><p>In this article, we'll explore the current state of workflow automation and look ahead to how it's likely to evolve in the coming years.</p><h2>The Current Landscape</h2><p>Today's workflow automation tools offer unprecedented capabilities to streamline business processes, reduce manual labor, and minimize human error. From marketing and sales to HR and finance, virtually every department can benefit from automating routine tasks and workflows.</p><p>Key features of modern workflow automation include:</p><ul><li>Visual workflow builders that allow non-technical users to create and modify workflows</li><li>Integration with a wide range of applications and data sources</li><li>Triggered actions based on events, schedules, or conditions</li><li>Real-time monitoring and analytics</li><li>Mobile accessibility for on-the-go management</li></ul><h2>Emerging Trends</h2><p>As we look to the future, several trends are shaping the evolution of workflow automation:</p><h3>1. AI-Powered Decision Making</h3><p>Artificial intelligence is enabling workflow automation systems to make increasingly complex decisions without human intervention. Machine learning algorithms can analyze vast amounts of data to identify patterns and make predictions, allowing for more sophisticated automated workflows.</p><h3>2. Hyperautomation</h3><p>Hyperautomation—the combination of multiple machine learning, packaged software, and automation tools—is gaining traction as organizations seek to automate as many business processes as possible. This approach integrates tools like RPA (Robotic Process Automation), AI, and process mining to achieve end-to-end automation.</p><h3>3. Low-Code/No-Code Platforms</h3><p>The rise of low-code and no-code platforms is democratizing workflow automation, making it accessible to business users without programming skills. These platforms enable rapid development and deployment of automated workflows, accelerating digital transformation initiatives.</p><h2>The Impact on Work</h2><p>As workflow automation becomes more advanced, it's transforming the nature of work itself. Routine, repetitive tasks are increasingly being automated, freeing up human workers to focus on more creative, strategic, and interpersonal aspects of their jobs.</p><p>This shift is creating new career opportunities in areas like automation management, process optimization, and human-machine collaboration. However, it also requires workers to develop new skills and adapt to changing job requirements.</p><h2>Preparing for the Future</h2><p>To stay ahead in an increasingly automated world, organizations should:</p><ul><li>Identify opportunities for automation across all departments and processes</li><li>Invest in training programs to help employees work effectively alongside automated systems</li><li>Develop a clear automation strategy that aligns with business goals</li><li>Choose flexible, scalable automation platforms that can evolve with changing needs</li><li>Establish governance frameworks to ensure responsible automation deployment</li></ul><p>By embracing the possibilities of advanced workflow automation while thoughtfully managing its implementation, organizations can position themselves for success in the digital future.</p>",
      image: "https://images.unsplash.com/photo-1580894909151-452fb8a7f523?auto=format&fit=crop&q=80&w=800&h=500",
      category: "Technology",
      tags: ["Automation", "Workflow", "Digital Transformation", "AI"],
      date: "2023-05-22",
      readTime: "6 min read",
      author: "Michael Chen",
      featured: true,
      translations: {
        fr: {
          title: "L'avenir de l'automatisation des flux de travail",
          excerpt: "Explorez comment l'automatisation avancée des flux de travail transforme les opérations commerciales dans tous les secteurs et ce que cela signifie pour l'avenir du travail.",
          content: "<p>L'automatisation des flux de travail a parcouru un long chemin, passant de simples systèmes basés sur des règles à des plateformes sophistiquées alimentées par l'intelligence artificielle et l'apprentissage automatique. Alors que les entreprises continuent de numériser leurs opérations, le rôle de l'automatisation des flux de travail devient de plus en plus central pour le succès organisationnel.</p><p>Dans cet article, nous explorerons l'état actuel de l'automatisation des flux de travail et examinerons comment elle est susceptible d'évoluer dans les années à venir.</p><h2>Le paysage actuel</h2><p>Les outils d'automatisation des flux de travail d'aujourd'hui offrent des capacités sans précédent pour rationaliser les processus d'entreprise, réduire le travail manuel et minimiser les erreurs humaines. Du marketing et des ventes aux RH et aux finances, pratiquement tous les départements peuvent bénéficier de l'automatisation des tâches et des flux de travail de routine.</p><p>Les caractéristiques clés de l'automatisation moderne des flux de travail comprennent :</p><ul><li>Des constructeurs visuels de flux de travail qui permettent aux utilisateurs non techniques de créer et de modifier des flux de travail</li><li>L'intégration avec une large gamme d'applications et de sources de données</li><li>Des actions déclenchées en fonction d'événements, de calendriers ou de conditions</li><li>La surveillance et l'analyse en temps réel</li><li>L'accessibilité mobile pour une gestion en déplacement</li></ul><h2>Tendances émergentes</h2><p>En regardant vers l'avenir, plusieurs tendances façonnent l'évolution de l'automatisation des flux de travail :</p><h3>1. Prise de décision alimentée par l'IA</h3><p>L'intelligence artificielle permet aux systèmes d'automatisation des flux de travail de prendre des décisions de plus en plus complexes sans intervention humaine. Les algorithmes d'apprentissage automatique peuvent analyser de vastes quantités de données pour identifier des modèles et faire des prédictions, permettant des flux de travail automatisés plus sophistiqués.</p><h3>2. Hyperautomatisation</h3><p>L'hyperautomatisation - la combinaison de plusieurs apprentissages automatiques, logiciels packagés et outils d'automatisation - gagne du terrain alors que les organisations cherchent à automatiser autant de processus d'entreprise que possible. Cette approche intègre des outils comme la RPA (Robotic Process Automation), l'IA et l'exploration de processus pour atteindre une automatisation de bout en bout.</p><h3>3. Plateformes Low-Code/No-Code</h3><p>La montée des plateformes low-code et no-code démocratise l'automatisation des flux de travail, la rendant accessible aux utilisateurs métier sans compétences en programmation. Ces plateformes permettent un développement et un déploiement rapides de flux de travail automatisés, accélérant les initiatives de transformation numérique.</p><h2>L'impact sur le travail</h2><p>À mesure que l'automatisation des flux de travail devient plus avancée, elle transforme la nature même du travail. Les tâches routinières et répétitives sont de plus en plus automatisées, libérant les travailleurs humains pour se concentrer sur les aspects plus créatifs, stratégiques et interpersonnels de leur emploi.</p><p>Ce changement crée de nouvelles opportunités de carrière dans des domaines tels que la gestion de l'automatisation, l'optimisation des processus et la collaboration homme-machine. Cependant, il exige également des travailleurs qu'ils développent de nouvelles compétences et s'adaptent à l'évolution des exigences professionnelles.</p><h2>Se préparer pour l'avenir</h2><p>Pour rester en tête dans un monde de plus en plus automatisé, les organisations devraient :</p><ul><li>Identifier les opportunités d'automatisation dans tous les départements et processus</li><li>Investir dans des programmes de formation pour aider les employés à travailler efficacement aux côtés des systèmes automatisés</li><li>Développer une stratégie d'automatisation claire qui s'aligne sur les objectifs de l'entreprise</li><li>Choisir des plateformes d'automatisation flexibles et évolutives qui peuvent évoluer avec les besoins changeants</li><li>Établir des cadres de gouvernance pour assurer un déploiement responsable de l'automatisation</li></ul><p>En embrassant les possibilités de l'automatisation avancée des flux de travail tout en gérant judicieusement sa mise en œuvre, les organisations peuvent se positionner pour réussir dans l'avenir numérique.</p>"
        },
        es: {
          title: "El futuro de la automatización de flujos de trabajo",
          excerpt: "Explore cómo la automatización avanzada de flujos de trabajo está transformando las operaciones comerciales en todas las industrias y lo que esto significa para el futuro del trabajo.",
          content: "<p>La automatización de flujos de trabajo ha recorrido un largo camino desde simples sistemas basados en reglas hasta sofisticadas plataformas impulsadas por inteligencia artificial y aprendizaje automático. A medida que las empresas continúan digitalizando sus operaciones, el papel de la automatización de flujos de trabajo se está volviendo cada vez más central para el éxito organizacional.</p><p>En este artículo, exploraremos el estado actual de la automatización de flujos de trabajo y miraremos hacia adelante para ver cómo es probable que evolucione en los próximos años.</p><h2>El panorama actual</h2><p>Las herramientas de automatización de flujos de trabajo actuales ofrecen capacidades sin precedentes para agilizar los procesos comerciales, reducir el trabajo manual y minimizar el error humano. Desde marketing y ventas hasta RRHH y finanzas, prácticamente todos los departamentos pueden beneficiarse de la automatización de tareas y flujos de trabajo rutinarios.</p><p>Las características clave de la automatización moderna de flujos de trabajo incluyen:</p><ul><li>Constructores visuales de flujos de trabajo que permiten a usuarios no técnicos crear y modificar flujos de trabajo</li><li>Integración con una amplia gama de aplicaciones y fuentes de datos</li><li>Acciones desencadenadas basadas en eventos, programaciones o condiciones</li><li>Monitoreo y análisis en tiempo real</li><li>Accesibilidad móvil para gestión en movimiento</li></ul><h2>Tendencias emergentes</h2><p>Al mirar hacia el futuro, varias tendencias están dando forma a la evolución de la automatización de flujos de trabajo:</p><h3>1. Toma de decisiones impulsada por IA</h3><p>La inteligencia artificial está permitiendo que los sistemas de automatización de flujos de trabajo tomen decisiones cada vez más complejas sin intervención humana. Los algoritmos de aprendizaje automático pueden analizar grandes cantidades de datos para identificar patrones y hacer predicciones, permitiendo flujos de trabajo automatizados más sofisticados.</p><h3>2. Hiperautomatización</h3><p>La hiperautomatización—la combinación de múltiples aprendizajes automáticos, software empaquetado y herramientas de automatización—está ganando tracción a medida que las organizaciones buscan automatizar tantos procesos comerciales como sea posible. Este enfoque integra herramientas como RPA (Automatización Robótica de Procesos), IA y minería de procesos para lograr una automatización de extremo a extremo.</p><h3>3. Plataformas Low-Code/No-Code</h3><p>El auge de las plataformas low-code y no-code está democratizando la automatización de flujos de trabajo, haciéndola accesible a usuarios empresariales sin habilidades de programación. Estas plataformas permiten el desarrollo rápido y la implementación de flujos de trabajo automatizados, acelerando las iniciativas de transformación digital.</p><h2>El impacto en el trabajo</h2><p>A medida que la automatización de flujos de trabajo se vuelve más avanzada, está transformando la naturaleza del trabajo mismo. Las tareas rutinarias y repetitivas están siendo cada vez más automatizadas, liberando a los trabajadores humanos para centrarse en aspectos más creativos, estratégicos e interpersonales de sus trabajos.</p><p>Este cambio está creando nuevas oportunidades de carrera en áreas como gestión de automatización, optimización de procesos y colaboración humano-máquina. Sin embargo, también requiere que los trabajadores desarrollen nuevas habilidades y se adapten a los requisitos cambiantes del trabajo.</p><h2>Preparándose para el futuro</h2><p>Para mantenerse a la vanguardia en un mundo cada vez más automatizado, las organizaciones deberían:</p><ul><li>Identificar oportunidades para automatización en todos los departamentos y procesos</li><li>Invertir en programas de capacitación para ayudar a los empleados a trabajar eficazmente junto con sistemas automatizados</li><li>Desarrollar una estrategia clara de automatización que se alinee con los objetivos comerciales</li><li>Elegir plataformas de automatización flexibles y escalables que puedan evolucionar con las necesidades cambiantes</li><li>Establecer marcos de gobernanza para asegurar una implementación responsable de la automatización</li></ul><p>Al adoptar las posibilidades de la automatización avanzada de flujos de trabajo mientras se gestiona cuidadosamente su implementación, las organizaciones pueden posicionarse para el éxito en el futuro digital.</p>"
        }
      }
    }
  ];
};

// In-memory blog posts storage with localStorage persistence
const blogPosts: BlogPost[] = getStoredBlogPosts();

// Save blog posts to localStorage
const saveBlogPosts = () => {
  localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
};

// Get all blog posts
export const getBlogPosts = (): BlogPost[] => {
  return blogPosts;
};

// Get a specific blog post by ID
export const getBlogPostById = (id: string): BlogPost | null => {
  const post = blogPosts.find(post => post.id === id);
  return post || null;
};

// Get featured blog posts
export const getFeaturedBlogPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.featured);
};

// Create a new blog post
export const createBlogPost = async (postData: Omit<BlogPost, "id" | "slug" | "translations">): Promise<BlogPost> => {
  // Generate a slug from the title
  const slug = postData.slug || postData.title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');
  
  // Generate translations for title, excerpt, and content
  const translations = await generateTranslations(
    postData.title,
    postData.excerpt,
    postData.content
  );
  
  // Create new blog post with a unique ID
  const newPost: BlogPost = {
    id: String(Date.now()), // Use timestamp for unique ID
    slug,
    translations,
    ...postData
  };
  
  // Add to in-memory storage
  blogPosts.push(newPost);
  saveBlogPosts(); // Save to localStorage
  return newPost;
};

// Update an existing blog post
export const updateBlogPost = async (id: string, postData: Partial<BlogPost>): Promise<BlogPost | null> => {
  const index = blogPosts.findIndex(post => post.id === id);
  if (index === -1) return null;
  
  const updatedPost = { ...blogPosts[index], ...postData };
  
  // If title, excerpt, or content was updated, regenerate translations
  if (
    postData.title !== blogPosts[index].title ||
    postData.excerpt !== blogPosts[index].excerpt ||
    postData.content !== blogPosts[index].content
  ) {
    const translations = await generateTranslations(
      updatedPost.title,
      updatedPost.excerpt,
      updatedPost.content
    );
    updatedPost.translations = translations;
  }
  
  blogPosts[index] = updatedPost;
  saveBlogPosts(); // Save to localStorage
  return updatedPost;
};

// Delete a blog post
export const deleteBlogPost = (id: string): boolean => {
  const index = blogPosts.findIndex(post => post.id === id);
  if (index === -1) return false;
  
  blogPosts.splice(index, 1);
  saveBlogPosts(); // Save to localStorage
  return true;
};

// Get blog posts by category
export const getBlogPostsByCategory = (category: string): BlogPost[] => {
  return blogPosts.filter(post => post.category.toLowerCase() === category.toLowerCase());
};

// Search blog posts
export const searchBlogPosts = (query: string): BlogPost[] => {
  const lowerCaseQuery = query.toLowerCase();
  return blogPosts.filter(post => 
    post.title.toLowerCase().includes(lowerCaseQuery) ||
    post.excerpt.toLowerCase().includes(lowerCaseQuery) ||
    post.content.toLowerCase().includes(lowerCaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
  );
};
