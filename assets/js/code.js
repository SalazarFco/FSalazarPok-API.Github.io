$(document).ready(function () {
  $("#pokemonForm").submit(function (event) {
    event.preventDefault();
    var nombre = $("#pokemonNombre").val().toLowerCase();
    var url = "https://pokeapi.co/api/v2/pokemon/" + nombre;

    $.ajax({
      url: url,
      type: "GET",
      success: function (data) {
        var Resultado = $("#Resultado");
        Resultado.html(`
                    <div id="pokemonCard1" class="card">
                        <div class="card-body">
        <div class="pokemon-info">
                                <img src="${data.sprites.front_default}" alt="${
          data.name
        }" />
                       <div class="PokemonCardPrimera">
                                    <h2>${
                                      data.name.charAt(0).toUpperCase() +
                                      data.name.slice(1)
                                    }</h2>
                                    <div>
                                        <p><strong>Formas:</strong> ${data.forms
                                          .map(
                                            (Formas) =>
                                              Formas.name
                                                .charAt(0)
                                                .toUpperCase() +
                                              Formas.name.slice(1)
                                          )
                                          .join(", ")}</p>
                                        <p><strong>Tipo:</strong> ${data.types
                                          .map(
                                            (Tipo) =>
                                              Tipo.type.name
                                                .charAt(0)
                                                .toUpperCase() +
                                              Tipo.type.name.slice(1)
                                          )
                                          .join(", ")}</p>
                                        <p><strong>Altura:</strong> ${
                                          data.height
                                        }</p>
                                        <p><strong>Peso:</strong> ${
                                          data.weight
                                        }</p>
                                        <p><strong>Habilidades:</strong> ${data.abilities
                                          .map(
                                            (Habilidades) =>
                                              Habilidades.ability.name
                                                .charAt(0)
                                                .toUpperCase() +
                                              Habilidades.ability.name.slice(1)
                                          )
                                          .join(", ")}</p>
                                          <p><strong>Habilidad Oculta:</strong> ${data.abilities
                                            .filter(
                                              (Habilidadoculta) =>
                                                Habilidadoculta.is_hidden
                                            )
                                            .map(
                                              (Habilidadoculta) =>
                                                Habilidadoculta.ability.name
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                Habilidadoculta.ability.name.slice(
                                                  1
                                                )
                                            )
                                            .join(", ")}</p>
                                        <p><strong>Movimientos:</strong> ${data.moves
                                          .map(
                                            (Movimiento) =>
                                              Movimiento.move.name
                                                .charAt(0)
                                                .toUpperCase() +
                                              Movimiento.move.name.slice(1)
                                          )
                                          .join(", ")}</p>

                                        
                                    </div>
                                    <p>Pokédex: <span id="Pokedex"></span></p>
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

        // Otra solicitud para la pokedex
        $.ajax({
          url: data.species.url,
          type: "GET",
          success: function (PokemonDEX) {
            var description = PokemonDEX.flavor_text_entries.find(
              (entry) => entry.language.name === "es"
            ).flavor_text;
            $("#Pokedex").text(description);
          },
          error: function (xhr, status, error) {
            Resultado.find(".pokemon-info-details").append(
              "<p>Error al obtener la descripción de la Pokédex</p>"
            );
          },
        });

        var totalStats = data.stats.reduce(
          (total, statInfo) => total + statInfo.base_stat,
          0
        );
        var estadisticas = data.stats.map((statInfo) => ({
          y: (statInfo.base_stat / totalStats) * 100,
          legendText: statInfo.stat.name + ": " + statInfo.base_stat,
          indexLabel: "{label} {y}",
        }));

        var chart = new CanvasJS.Chart("chartContainer", {
          animationEnabled: true,
          title: {
            text: "Estadísticas Base",
          },
          legend: {
            maxWidth: 350,
            itemWidth: 120,
          },
          data: [
            {
              type: "pie",
              startAngle: 240,
              yValueFormatString: '##0.00"%"',
              indexLabel: "{label} {y}",
              legendText: "{legendText}",
              showInLegend: true,
              dataPoints: estadisticas,
            },
          ],
        });

        chart.render();
      },
      error: function (xhr, status, error) {
        var Resultado = $("#Resultado");
        Resultado.html(
          '<div class="alert alert-danger" role="alert">Pokémon no encontrado. Por favor, verifica el nombre e intenta de nuevo.</div>'
        );
      },
    });
  });
});
