const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const configs = require('./config.json');
const google = require('googleapis');
const bot = new Discord.Client();

const youtube = new google.youtube_v3.Youtube({
    version: 'v3',
    auth: configs.google_key
});

const prefixo = configs.prefix;

const servidores = {
    'server': {
        connection: null,
        dispatcher: null,
        fila: [],
        estouTocando: false
    }
}

bot.on("ready", () => {
    console.log('Estou online');
    bot.user.setActivity("Comendo sua Mulher")
});

bot.on("message", async (msg) => {

    //filtro
    if (!msg.guild) return;

    if (!msg.content.startsWith(prefixo)) return;

    if (!msg.member.voice.channel) {
        msg.channel.send('Você precisa estar num canal de voz!'); return;
    }


    //comandos
    if (msg.content === prefixo + 'join') {
        try {
            servidores.server.connection = await msg.member.voice.channel.join();
        } catch (err) {
            console.log('Erro ao entar num canal de voz!');
            console.log(err);
        }

    }

    if (msg.content === prefixo + 'leave') {
        msg.member.voice.channel.leave();
        servidores.server.connection = null;
        servidores.server.dispatcher = null;
    }

    if (msg.content.startsWith(prefixo + 'play')) {
        let oQueTocar = msg.content.slice(6);

        if (oQueTocar.length === 0) {
            msg.channel.send('Eu preciso de algo para gozar!');
            return;
        }

        if (servidores.server.connection === null) {
            try {
                servidores.server.connection = await msg.member.voice.channel.join();
            }
            catch (err) {
                console.log('Esta no quarto errado ja vou gozar!');
                console.log(err);
            }
        }

        if (ytdl.validateURL(oQueTocar)) {
            servidores.server.fila.push(oQueTocar);
            console.log('Adicionado: ' + oQueTocar);
            tocarMusica();
        }
        else {
            youtube.search.list({
                q: oQueTocar,
                part: 'snippet',
                fields: 'items(id(videoId),snippet(title,channelTitle))',
                type: 'video'
            }, function (err, resultado) {
                if (err) {
                    console.log(err);
                }
                if (resultado) {

                    // organiza resultados 
                    const listaResultados = [];
                    for (let i in resultado.data.items) {
                        const montaItem = {
                            'tituloVideo': resultado.data.items[i].snippet.title,
                            'nomeCanal': resultado.data.items[i].snippet.channelTitle,
                            'id': 'https://www.youtube.com/watch?v=' + resultado.data.items[i].id.videoId
                        }

                        listaResultados.push(montaItem);
                    }

                    // constroi a messagem Embed
                    const embed = new Discord.MessageEmbed()
                        .setColor([112, 20, 113])
                        .setAuthor('Corno Bot')
                        .setDescription('Escolha sua música de 1-5! sua mulher ta boa?');
                    //campos da lista
                    for (let i in listaResultados) {
                        embed.addField(
                            `${parseInt(i) + 1}: ${listaResultados[i].tituloVideo}`,
                            listaResultados[i].nomeCanal
                        );
                    }

                    msg.channel.send(embed)
                        .then((embedMessage) => {
                            const possiveisReacoes = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
                            // reage na messagem pra emoji
                            for (let i = 0; i < possiveisReacoes.length; i++) {
                                embedMessage.react(possiveisReacoes[i]);
                            }

                            const filter = (reaction, user) => {
                                return possiveisReacoes.includes(reaction.emoji.name)
                                    && user.id === msg.author.id;
                            }

                            embedMessage.awaitReactions(filter, { max: 1, time: 20000, errors: ['time'] })
                                .then((collected) => {
                                    const reaction = collected.first();
                                    const idOpcaoEscolhida = possiveisReacoes.indexOf(reaction.emoji.name)

                                    msg.channel.send(`Você escolheu ${listaResultados[idOpcaoEscolhida].tituloVideo} de ${listaResultados[idOpcaoEscolhida].nomeCanal}`);

                                    servidores.server.fila.push(listaResultados[idOpcaoEscolhida].id);
                                    tocarMusicas();
                                })
                                .catch((error) => {
                                    msg.reply('Isso é o que dá ficar batendo punheta');
                                    console.log(error);

                                });
                        });

                }
            });
        }
    }

    if (msg.content.startsWith(`${prefixo}skip`)) {
        skip(msg, serverQueue);
        return;
    } else if (msg.content.startsWith(`${prefixo}stop`)) {
        stop(msg, serverQueue);
        return;
    } else {
        msg.channel.send("Escolha uma música seu corno!");
    }


    if (msg.content === prefixo + 'pause') {
        servidores.server.dispatcher.pause();
    }
    if (msg.content === prefixo + 'resume') {
        servidores.server.dispatcher.resume();
    }

    if (msg.content.startsWith('Buba')) {
        msg.channel.send('3 anos sem comer uma bucetinha');
    }

    if (msg.content.startsWith('buba')) {
        msg.channel.send('3 anos sem comer uma bucetinha');
    }

    if (msg.content.startsWith('Corno')) {
        msg.channel.send('Sua mulher te trai');
    }

    if (msg.content.startsWith('Malhado')) {
        msg.channel.send('Gosta de ser Corno');
    }

    if (msg.content.startsWith('malhado')) {
        msg.channel.send('Corno por esporte');
    }

    if (msg.content.startsWith('Ayrton')) {
        msg.channel.send('Levaram a dona dona');
    }

    if (msg.content.startsWith('ayrton')) {
        msg.channel.send('Levaram a dona dona');
    }

    if (msg.content.startsWith('Mizifi')) {
        msg.channel.send('chato pra caralho');
    }

    if (msg.content.startsWith('mizifi')) {
        msg.channel.send('chato pra caralho');
    }

    if (msg.content.startsWith('gari')) {
        msg.channel.send('marido da chupisquinha');
    }

    if (msg.content.startsWith('Gari')) {
        msg.channel.send('marido da chupisquinha');
    }

    if (msg.content.startsWith('pablo')) {
        msg.channel.send('Corno manso');
    }

    if (msg.content.startsWith('pablo')) {
        msg.channel.send('corno manso');
    }

    if (msg.content.startsWith('monkey')) {
        msg.channel.send('pai da mentira');
    }

    if (msg.content.startsWith('Monkey')) {
        msg.channel.send('pai da mentira');
    }

});


const tocarMusicas = () => {
    if (servidores.server.estouTocando === false) {
        const tocando = servidores.server.fila[0];
        servidores.server.estouTocando = true;
        servidores.server.dispatcher = servidores.server.connection.play(ytdl(tocando, configs.YTDL));

        servidores.server.dispatcher.on('finish', () => {
            servidores.server.fila.shift();
            servidores.server.estouTocando = false;

            if (servidores.server.fila.length > 0) {
                tocarMusicas();
            }
            else {
                servidores.server.dispatcher = null;
            }
        });
    }

}

bot.login(configs.token_discord);
