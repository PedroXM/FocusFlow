

class SoundService {
  constructor() {
    this.isSoundEnabled = true;
  }

  // Em vez de carregar sons reais, apenas simulamos
  async loadSounds() {
    console.log('Sons foram carregados (simulado)');
  }

  // Em vez de tocar sons, apenas registramos no console
  async playSound(soundName) {
    if (!this.isSoundEnabled) return;
    console.log(`[SOM]: Tocando ${soundName}`);
  }

  // Habilitar/desabilitar sons
  setSoundEnabled(enabled) {
    this.isSoundEnabled = enabled;
    console.log(`Sons ${enabled ? 'ativados' : 'desativados'}`);
  }
}

// Exportar uma única instância para usar em todo o app
export default new SoundService();