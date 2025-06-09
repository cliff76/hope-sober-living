// This creates the About Us page.
// The header and footer are provided by layout.tsx.

export default function AboutPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-blue-800 mb-8 text-center">
        About Hope's Sober Living
      </h1>
      
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto text-slate-700">
        <p className="mb-4 text-lg">
          Hope's Sober Living, under the dedicated ownership of Hosea, has been a beacon of light and a pillar of support for countless individuals navigating the challenging path of recovery. Our center is founded on the principles of compassion, understanding, and unwavering commitment to helping people reclaim their lives from addiction.
        </p>
        <p className="mb-4 text-lg">
          We provide a safe, structured, and nurturing environment where residents can focus on their sobriety and personal growth. Our programs are designed to empower individuals with the tools, resources, and community support necessary to build a sustainable, healthy, and fulfilling life free from substance dependence.
        </p>
        <p className="mb-4 text-lg">
          Many have walked through our doors feeling lost and overwhelmed, and have emerged with renewed hope, strengthened resolve, and a clear vision for their future. The success stories of our alumni are a testament to the transformative power of a supportive community and a dedicated approach to recovery. At Hope's Sober Living, we don't just offer a place to stay; we offer a chance to rebuild, to heal, and to rediscover the joy of living.
        </p>
        <p className="text-lg">
          Hosea and the entire team at Hope's Sober Living are passionate about making a difference, one life at a time. We believe in every individual's capacity for change and are here to support them every step of the way.
        </p>
      </div>
    </div>
  );
}
