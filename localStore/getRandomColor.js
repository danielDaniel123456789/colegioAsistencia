// Función para obtener un color aleatorio para el avatar
function getRandomColor() {
    const colors = [
        '#FF5733', '#33d3ff', '#3357FF', '#F39C12', '#9B59B6', '#1ABC9C',
        '#E74C3C', '#3498DB', '#2ECC71', '#F1C40F', '#E67E22', '#16A085',
        '#D35400', '#8E44AD', '#27AE60', '#2980B9', '#C0392B', '#BDC3C7',
        '#7F8C8D', '#2C3E50', '#FF4500', '#FFD700', '#8A2BE2', '#00FA9A',
        '#20B2AA', '#DC143C', '#00BFFF', '#FF1493', '#ADFF2F', '#FF69B4',
        '#B0E0E6', '#8B0000', '#556B2F', '#483D8B', '#DAA520', '#FF8C00',
        '#9932CC', '#00CED1', '#8FBC8F', '#4169E1', '#800000', '#FF6347',
        '#32CD32', '#9370DB', '#008080', '#4682B4', '#F08080', '#C71585',
        '#FFA07A', '#B22222', '#00FF7F', '#7B68EE', '#D2691E', '#40E0D0',
        '#A52A2A', '#87CEEB', '#B8860B', '#708090', '#6A5ACD', '#FF00FF',
        '#FA8072', '#228B22', '#CD5C5C', '#FFDEAD', '#20B2AA', '#5F9EA0',
        '#DB7093', '#008B8B', '#800080', '#FAEBD7', '#2E8B57', '#E9967A'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}
