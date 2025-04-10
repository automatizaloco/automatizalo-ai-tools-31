
import React from 'react';
import { Toaster } from 'sonner';
import { PersistentToastProvider } from "@/context/PersistentToastContext";

function App() {
  return (
    <PersistentToastProvider>
      <div className="flex min-h-screen flex-col">
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Welcome to Automatizalo</h1>
            <p className="text-center text-lg">Explore our services through the navigation menu.</p>
          </div>
        </main>
      </div>
      <Toaster />
    </PersistentToastProvider>
  );
}

export default App;
