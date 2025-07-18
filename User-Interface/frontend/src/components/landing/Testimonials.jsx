import React from "react";

const Testimonials = () => {
  const testimonials = [
    {
      content:
        "Medibot has completely changed how I manage my health. The medication reminders are a lifesaver, and the AI chat helps me understand my symptoms before deciding if I need to see a doctor.",
      author: "Priya S.",
      role: "User with chronic condition",
      image: "https://randomuser.me/api/portraits/women/17.jpg",
    },
    {
      content:
        "As a busy professional, I often neglect my health. Medibot makes it simple to track my vitals and understand trends. The interface is intuitive and the insights are genuinely helpful.",
      author: "Michael T.",
      role: "Marketing Executive",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      content:
        "I use Medibot to help manage my parents' healthcare remotely. The appointment scheduling and medication tracking features give me peace of mind that they're staying on top of their health.",
      author: "Aisha K.",
      role: "Caregiver",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  ];

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="py-20 w-full max-w-7xl mx-auto px-6"
      style={{ opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2
            id="testimonials-heading"
            className="text-3xl font-extrabold sm:text-4xl text-left text-white"
          >
            What Our Users Say
          </h2>
          <p
            role="doc-subtitle"
            className="mt-4 max-w-2xl text-xl mx-auto text-left"
            style={{ color: "#d6d4d4" }}
          >
            Real stories from people managing their health with Medibot.
          </p>
        </div>

        <div role="list" className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              role="listitem"
              className=" transform transition-transform duration-300 hover:translate-y-[-5px] p-8 relative text-card-foreground bg-slate-800/50 rounded-xl backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-purple-500/10 h-full"
            >
              {/* Quote icon */}
              <div
                className="absolute top-4 right-4 opacity-20"
                aria-hidden="true"
              >
                <svg
                  width="45"
                  height="36"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ fill: "#6366f1" }}
                >
                  <path d="M13.415.001C6.07 5.185.887 13.681.887 23.041c0 7.632 4.608 12.096 9.936 12.096 5.04 0 8.784-4.032 8.784-8.784 0-4.752-3.312-8.208-7.632-8.208-.864 0-2.016.144-2.304.288.72-4.896 5.328-10.656 9.936-13.536L13.415.001zm24.768 0c-7.2 5.184-12.384 13.68-12.384 23.04 0 7.632 4.608 12.096 9.936 12.096 4.896 0 8.784-4.032 8.784-8.784 0-4.752-3.456-8.208-7.776-8.208-.864 0-1.872.144-2.16.288.72-4.896 5.184-10.656 9.792-13.536L38.183.001z" />
                </svg>
              </div>

              <p
                className="mb-6 relative z-10 text-slate-200 text-lg italic"
                style={{ color: "#d6d4d4" }}
              >
                "{testimonial.content}"
              </p>

              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="h-12 w-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="text-white font-medium">
                    {testimonial.author}
                  </h4>
                  <p className="text-sm text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
