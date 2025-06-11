// This creates the Testimonials page.
// The header and footer are provided by layout.tsx.

const testimonials = [
  {
    id: 1,
    name: "John D.",
    story: "Hope's Sober Living provided me with the structure and support I desperately needed. The community here is like a family, and Hosea's guidance was invaluable. I'm now 2 years sober and have rebuilt my life.",
    avatarInitial: "J",
  },
  {
    id: 2,
    name: "Sarah P.",
    story: "I was scared and felt alone before coming to Hope's. The environment is so welcoming and understanding. I learned coping mechanisms that I use every day. This place truly saved me.",
    avatarInitial: "S",
  },
  {
    id: 3,
    name: "Michael B.",
    story: "The peer support at Hope's Sober Living was a game-changer for me. Being around others who understood my struggles made all the difference. I'm grateful for the second chance this place gave me.",
    avatarInitial: "M",
  },
  {
    id: 4,
    name: "Lisa R.",
    story: "Hosea and the team are incredibly compassionate. They don't just provide a roof over your head; they genuinely care about your recovery journey. I found hope and strength I didn't know I had.",
    avatarInitial: "L",
  },
];

export default function TestimonialsPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-[var(--accent-green)] mb-12 text-center">
        Voices of Hope: Our Stories
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[var(--sky-blue)] text-white flex items-center justify-center text-xl font-bold mr-4">
                {testimonial.avatarInitial}
              </div>
              <h3 className="text-2xl font-semibold text-slate-800">{testimonial.name}</h3>
            </div>
            <p className="text-slate-700 text-lg leading-relaxed flex-grow">
              &quot;{testimonial.story}&quot;
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
