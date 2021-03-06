import {connect, Nuid} from "./nats.mjs";


// add an entry to the document
function addEntry (s) {
  const p = document.createElement('pre')
  p.appendChild(document.createTextNode(s))
  document.getElementById('log').appendChild(p)
}

const nuid = new Nuid();

async function run() {
  const id = nuid.next()
  const nc = connect({url: 'localhost:9222', debug: true})
    .then((nc) => {
    addEntry(`connected as ${id} to ${nc.getServer()}`)
    nc.closed()
      .then((err) => {
        if(err) {
          addEntry(`closed with error ${err.message}`);
        } else {
          addEntry(`closed`);
        }
      });

    const who = nc.subscribe("who");
    const whodone = (async () => {
      for await (const m of who) {
        nc.publish("here", id);
      }
    })();

    const all = nc.subscribe(">");
    const allDone = (async () => {
      let i = 1;
      for await (const m of all) {
        addEntry(`[${i++}] ${m.subject}: ${m.data}`)
      }
    })();

    nc.publish('entered', id);
    nc.publish('who');
  }).catch((err) => {
    addEntry(`error ${err}`);
    console.log(err);
  })


    // .then(async (nc) => {
    //   addEntry(`connected as ${id} to ${nc.options.url}`)
    //
    //   // handle errors
    //   nc.addEventListener('error', (err) => {
    //     addEntry(`error: ${err.toString()}`)
    //     addEntry(`reloading in 1s`)
    //     setTimeout(() => {
    //       location.reload()
    //     }, 1000)
    //   })
    //
    //   // handle close
    //   nc.addEventListener('close', () => {
    //     addEntry(`connection closed`)
    //     addEntry(`will attempt to reconnect in 1s`)
    //     setTimeout(() => {
    //       location.reload()
    //     }, 1000)
    //   })
    //
    //   nc.subscribe('who', () => {
    //       nc.publish('here', id)
    //   })
    //
    //   let i = 0
    //   nc.subscribe('>', (err, m) => {
    //     if (err) {
    //       console.log('error', err)
    //       return
    //     }
    //     i++
    //     addEntry(`[${i}] ${m.subject}: ${m.data}`)
    //   })
    //   await nc.flush()
    //
    //   nc.publish('entered', id)
    //   nc.publish('who')
    // })
    // .catch((err) => {
    //   addEntry(`error connecting: ${err.toString()}`)
    //   addEntry(`will reload in 1000`)
    //   setTimeout(() => {
    //     location.reload()
    //   }, 1000)
    // })
}
run()
