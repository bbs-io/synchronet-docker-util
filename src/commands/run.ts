import docker from "@tracker1/docker-cli";
import ensureDirs from "../utils/ensure-sbbsdirs";
import sbbsdir from "../utils/sbbsdir";
import getImageName from "../utils/get-image-name";

export default async (...args: string[]) => {
  const image = await getImageName();
  await ensureDirs();
  await docker(
    `
      run 
        --rm 
        -t
        -v ${sbbsdir}/backup:/backup
        -v ${sbbsdir}/ctrl:/sbbs/ctrl
        -v ${sbbsdir}/text:/sbbs/text
        -v ${sbbsdir}/web:/sbbs/web
        -v ${sbbsdir}/data:/sbbs/data
        -v ${sbbsdir}/fido:/sbbs/fido
        -v ${sbbsdir}/xtrn:/sbbs/xtrn
        -v ${sbbsdir}/mods:/sbbs/mods
        -v ${sbbsdir}/nodes:/sbbs/nodes
        ${image}
        sbbs-run
        "${args.map((a) => `"${a}"`).join(" ")}"
    `
      .trim()
      .replace(/[\r\n\s+]/g, " ")
  );
};
