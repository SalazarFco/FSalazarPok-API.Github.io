$(document).ready(function(){
    $('#pokemonForm').submit(function(event) {
        event.preventDefault();
        var nombre = $('#pokemonNombre').val().toLowerCase();
        var url = 'https://pokeapi.co/api/v2/pokemon/' + nombre;

        $.ajax({
            url: url,
            type: 'GET',
            success: function(data) {
                var resultado = $('#resultado');
                resultado.html(`
                    <div id="pokemonCard" class="card">
                        <div class="card-body">
                            <div class="pokemon-info">
                                <img src="${data.sprites.front_default}" alt="${data.name}" />
                                <div class="pokemon-info-details">
                                    <h2>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
                                    <div>
                                        <p>Tipo: ${data.types.map(typeInfo => typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1)).join(', ')}</p>
                                        <p>Altura: ${data.height}</p>
                                        <p>Peso: ${data.weight}</p>
                                        <p>Habilidades: ${data.abilities.map(abilityInfo => abilityInfo.ability.name.charAt(0).toUpperCase() + abilityInfo.ability.name.slice(1)).join(', ')}</p>
                                        <p>Movimientos: ${data.moves.map(moveInfo => moveInfo.move.name.charAt(0).toUpperCase() + moveInfo.move.name.slice(1)).join(', ')}</p>
                                        <p>Formas: ${data.forms.map(formInfo => formInfo.name.charAt(0).toUpperCase() + formInfo.name.slice(1)).join(', ')}</p>
                                        <p>Habilidad Oculta: ${data.abilities.filter(abilityInfo => abilityInfo.is_hidden).map(hiddenAbility => hiddenAbility.ability.name.charAt(0).toUpperCase() + hiddenAbility.ability.name.slice(1)).join(', ')}</p>
                                    </div>
                                    <p>Descripción de la Pokédex: <span id="dexDescription"></span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="chartCard" class="card">
                        <div class="card-body">
                            <div id="chartContainer" style="height: 300px; width: 100%;"></div>
                        </div>
                    </div>
                `);

                // Ahora haces una solicitud adicional para obtener los detalles de la especie
                $.ajax({
                    url: data.species.url,
                    type: 'GET',
                    success: function(speciesData) {
                        var description = speciesData.flavor_text_entries.find(entry => entry.language.name === "es").flavor_text;
                        $('#dexDescription').text(description);
                    },
                    error: function(xhr, status, error) {
                        resultado.find('.pokemon-info-details').append('<p>Error al obtener la descripción de la Pokédex</p>');
                    }
                });

                var totalStats = data.stats.reduce((total, statInfo) => total + statInfo.base_stat, 0);
                var estadisticas = data.stats.map(statInfo => ({
                    y: (statInfo.base_stat / totalStats) * 100,
                    legendText: statInfo.stat.name + ": " + statInfo.base_stat,
                    indexLabel: "{label} {y}"
                }));

                var chart = new CanvasJS.Chart("chartContainer", {
                    animationEnabled: true,
                    title: {
                        text: "Estadísticas Base"
                    },
                    legend: {
                        maxWidth: 350,
                        itemWidth: 120
                    },
                    data: [{
                        type: "pie",
                        startAngle: 240,
                        yValueFormatString: "##0.00\"%\"",
                        indexLabel: "{label} {y}",
                        legendText: "{legendText}",
                        showInLegend: true,
                        dataPoints: estadisticas
                    }]
                });

                chart.render();
            },
            error: function(xhr, status, error) {
                var resultado = $('#resultado');
                resultado.html('<div class="alert alert-danger" role="alert">Pokémon no encontrado. Por favor, verifica el nombre e intenta de nuevo.</div>');
            }
        });
    });
});