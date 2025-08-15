# Dashboard de Comisiones

Dashboard para gestión y visualización de comisiones de viajes con esquemas de bonos y liquidaciones.

## 🚀 Demo en Vivo

**GitHub Pages**: [https://tuusuario.github.io/commissions-dashboard-fixed/](https://tuusuario.github.io/commissions-dashboard-fixed/)

## 📋 Características

- **Dashboard Principal**: KPIs, gráficas y tablas de comisiones
- **Sistema de Aprobaciones**: Aprobación/rechazo de comisiones y bonos 5S
- **Esquemas de Comisiones**: Nuevo (9%) y Anterior (9%)
- **Bonos 5S**: $2,000 por 1 review, $500 extra por cada adicional
- **Histórico Mensual**: Evolución de comisiones con gráficas interactivas
- **Filtros Avanzados**: Por especialista, rol, status y tipo de viaje
- **Exportación**: Datos exportables a Excel

## 🛠️ Tecnologías

- **Frontend**: React + TypeScript
- **Estilos**: Tailwind CSS
- **Gráficas**: Recharts
- **Tablas**: TanStack Table
- **Build**: Vite
- **Deploy**: GitHub Pages

## 🚀 Instalación Local

```bash
# Clonar repositorio
git clone https://github.com/tuusuario/commissions-dashboard-fixed.git
cd commissions-dashboard-fixed

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

## 📦 Deploy a GitHub Pages

### Opción 1: Automático (Recomendado)
1. Hacer push a la rama `main`
2. GitHub Actions se ejecutará automáticamente
3. El dashboard estará disponible en `https://tuusuario.github.io/commissions-dashboard-fixed/`

### Opción 2: Manual
```bash
# Build del proyecto
npm run build:gh-pages

# Subir a rama gh-pages
git add dist -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

## ⚙️ Configuración

### Variables de Entorno
- No se requieren variables de entorno para el demo
- Los datos se generan automáticamente con `mockData.ts`

### Personalización
- **Porcentajes**: Editar en `src/lib/mockData.ts`
- **Colores**: Modificar en `tailwind.config.js`
- **Datos**: Ajustar en `src/lib/mockData.ts`

## 📱 Uso

1. **Seleccionar Período**: Usar el selector de mes/año en la parte superior
2. **Filtrar Datos**: Aplicar filtros por especialista, rol o status
3. **Revisar Comisiones**: Hacer clic en cualquier booking para ver detalles
4. **Aprobar/Rechazar**: Usar los botones de aprobación en el modal
5. **Exportar**: Descargar datos en Excel usando el botón de exportación

## 🔒 Privacidad

- **No se conecta a tu sitio principal**
- **URL independiente**: `tuusuario.github.io/commissions-dashboard-fixed/`
- **Datos mock**: No hay información real de clientes
- **Acceso público**: Cualquiera con el enlace puede ver el demo

## 📞 Soporte

Para reportar bugs o solicitar features, crear un issue en este repositorio.

## 📄 Licencia

MIT License - ver archivo LICENSE para más detalles.
