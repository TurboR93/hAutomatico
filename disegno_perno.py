import matplotlib.pyplot as plt
import matplotlib.patches as patches

# Configurazione del disegno
fig, ax = plt.subplots(figsize=(12, 6))

# Dati dimensionali (mm)
L_testa = 43.31
D_testa = 25.91
L_fusto_totale = 154.00
D_fusto = 19.84
L_totale = L_testa + L_fusto_totale
D_filetto = 18.0
L_filetto = 30.0

# Coordinate per centrare il pezzo sull'asse Y (Y=0 è il centro)
y_testa_bottom = -D_testa / 2
y_fusto_bottom = -D_fusto / 2
y_filetto_bottom = -D_filetto / 2

# 1. Disegno la TESTA
rect_testa = patches.Rectangle((0, y_testa_bottom), L_testa, D_testa, 
                               linewidth=2, edgecolor='black', facecolor='#d9d9d9')
ax.add_patch(rect_testa)

# 2. Disegno il FUSTO (Parte liscia)
# La parte liscia finisce dove inizia il filetto
L_liscio = L_fusto_totale - L_filetto
rect_fusto = patches.Rectangle((L_testa, y_fusto_bottom), L_liscio, D_fusto, 
                               linewidth=2, edgecolor='black', facecolor='#d9d9d9')
ax.add_patch(rect_fusto)

# 3. Disegno il FILETTATURA (Schematico)
rect_filetto = patches.Rectangle((L_testa + L_liscio, y_filetto_bottom), L_filetto, D_filetto, 
                                 linewidth=2, edgecolor='black', facecolor='#bfbfbf', hatch='///')
ax.add_patch(rect_filetto)

# 4. Linea d'asse
ax.plot([-10, L_totale + 10], [0, 0], color='black', linestyle='-.', linewidth=1)

# --- QUOTATURA ---

# Funzione helper per le quote
def draw_dim(x_start, x_end, y_level, text, ax, arrow_len=5):
    ax.annotate('', xy=(x_start, y_level), xytext=(x_end, y_level),
                arrowprops=dict(arrowstyle='<->', color='black'))
    ax.text((x_start + x_end)/2, y_level + 1, text, ha='center', va='bottom', fontsize=12, fontweight='bold')
    # Linee di riferimento verticali
    ax.plot([x_start, x_start], [0, y_level], color='black', linewidth=0.5, linestyle=':')
    ax.plot([x_end, x_end], [0, y_level], color='black', linewidth=0.5, linestyle=':')

# Quota Lunghezza Testa
draw_dim(0, L_testa, D_testa/2 + 10, f"{L_testa} mm", ax)

# Quota Lunghezza Fusto (Totale)
draw_dim(L_testa, L_totale, D_testa/2 + 10, f"{L_fusto_totale} mm", ax)

# Quota Diametro Testa
ax.annotate(f"Ø {D_testa} (h7)", xy=(L_testa/2, -D_testa/2), xytext=(L_testa/2, -D_testa/2 - 15),
            arrowprops=dict(arrowstyle='-', color='black'), ha='center', fontsize=12, fontweight='bold')
ax.plot([L_testa/2, L_testa/2], [-D_testa/2, D_testa/2], color='black', linewidth=0.5) # Linea diametrale

# Quota Diametro Fusto
ax.annotate(f"Ø {D_fusto} (+0/-0.05)", xy=(L_testa + L_liscio/2, -D_fusto/2), xytext=(L_testa + L_liscio/2, -D_fusto/2 - 15),
            arrowprops=dict(arrowstyle='-', color='black'), ha='center', fontsize=12, fontweight='bold')

# Quota Filetto
ax.text(L_totale - L_filetto/2, -D_filetto/2 - 15, "M18x1.5", ha='center', fontsize=12, fontweight='bold', color='blue')

# Impostazioni grafico
ax.set_xlim(-10, L_totale + 10)
ax.set_ylim(-40, 50)
ax.set_aspect('equal')
ax.axis('off') # Nasconde assi cartesiani
plt.title("DISEGNO TECNICO PERNO RUOTA", fontsize=14)

# Salva e mostra
plt.tight_layout()
plt.show()






