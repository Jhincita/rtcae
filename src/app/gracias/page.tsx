export default function GraciasPage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#342829] mb-4">
                ¡Gracias por contactarnos!
            </h1>
            <p className="text-xl md:text-2xl text-[#342829]/80 mb-8">
                Hemos recibido tu información. Un asesor se pondrá en contacto contigo a la brevedad.
            </p>
            <a
                href="/"
                className="px-6 py-3 bg-[#4F51B3] text-white rounded-lg hover:bg-[#3e4094] transition"
            >
                Volver al inicio
            </a>
        </div>
    );
}