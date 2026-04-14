
export default function Intro() {
    return (
        <section className="max-w-4xl mx-auto px-6 py-12">
            <div className="space-y-6">
                <p className="text-3xl md:text-4xl font-black leading-tight">
                    ¿10 o 30 días hábiles? <span>El plazo está corriendo</span>
                </p>

                {/* Added text-justify to the main paragraph */}
                <p className="text-lg md:text-xl leading-relaxed text-justify">
                    ¿Sabías que desde la notificación de la TGR tienes solo <strong>10 días hábiles</strong> para presentar una oposición al mandamiento de ejecución y embargo? Si ese plazo vence sin acción, el proceso avanza. Si te notificó el banco, el plazo aumenta a <strong>30 días</strong>, pero cada hora que pasa sin actuar te deja con menos posibilidades de poder demorar el cobro, evitar los embargos, y negociar con la justicia a tu favor.
                </p>

                {/* Optional: justify this paragraph too */}
                <p className="text-lg md:text-xl">
                    Si actúas a tiempo, hay herramientas jurídicas reales disponibles.
                </p>

                <p className="text-lg md:text-xl">
                     <p>Déjanos tus datos y evaluamos tu caso.</p>
                    Rellena el formulario y <span className="font-semibold">te contactamos hoy.</span>

                </p>

                <p className="text-base">

                </p>
            </div>
        </section>
    );
}