import { textOnly } from "../utils/textOnly.js";
import { textAndImage } from "../utils/textAndImage.js";
import fetch from 'node-fetch';
import axios from 'axios';

export const aiController = async (req, res) => {
  //const modelType = req.body.modelType;
  const modelType = "text_only";
  const textType = req.body.textType;
  const receivedName = req.body.receivedName;
  const groupName = req.body.groupName;
  let prompt = `Role: 你是采购经理,你需要判断提供的内容是那一种case,然后根据case执行对应的action. \
		Case: \
		1. Add orders
		2. Remove orders
		3. Inquiries
		4. Others
		Actions: \
		1. Add orders:
		1.1 尝试在内容中提取商品名称,数量，单位
		1.2 如果没有识别或提取到数量，则默认数量为1
		1.3 如果没有识别或提取到单位，则默认为空值
		1.4 最后把结果warp为json格式输出
		2. Remove orders:
		2.1 尝试在内容中提取商品名称,数量，单位
		2.2 如果没有识别或提取到数量，则默认数量为1
		2.3 如果没有识别或提取到单位，则默认为空值
		2.4 最后把结果warp为json格式连同这个字段:"已删除 \n"一起输出
		3. Inquiries:
		3.1 尝试在内容中提取商品名称
		3.2 把提取到的商品名称标注出其他常用的别名,例如中国南方和北方的叫法,和正式的学科名
		3.3 总结这段内容 
		3.4 返回商品名称+ [别名] + [学科名] + 总结内容 + Case Name \n
		4. Others:
		4.1 总结这段内容
		4.2 返回总结内容 + Case Name \n
		Below are contents:`;
  let text;
  switch (textType) {
        case 1:
            const spoken = req.body.spoken;
            // Generate and return your specific prompt based on 'spoken'
            prompt = prompt.concat(spoken);
            break;
        default:
            prompt = ''; // Or handle other cases as needed
  }

  if (modelType === "text_only") {
    if (prompt != "")
    {
      let timeoutFlag = false;

      const botReplyPromise = textOnly(prompt);

      const responseTimeout = setTimeout(() => {
        if (!timeoutFlag) {
        	timeoutFlag = true;
        	res.status(200).send(response('请稍等')); // Send "please wait"
        	processAsync(botReplyPromise, receivedName, groupName);
        }
      }, 3000);

      const botReply = await botReplyPromise;
      clearTimeout(responseTimeout); // Clear the timeout
      //const botReply = await textOnly(prompt);
      if (!timeoutFlag) {
        if (botReply?.Error) {
          return res.status(404).json({ Error: botReply.Error });
        }
      	res.status(200).json(response(botReply.result));
      }
    } else {    
      res.status(200).json(response(''));
    }
  } else if (modelType === "text_and_image") {
    const botReply = await textAndImage(req.body.prompt, req.body.imageParts);

    if (botReply?.Error) {
      return res.status(404).json({ Error: botReply.Error });
    }

    res.status(200).json({ result: botReply.result });
  } else {
    res.status(404).json({ result: "Invalid Model Selected" });
  }
};

function response(result) {
  return {
    code: 0, // You can define the code based on your logic
    message: "Success", // Or any relevant message
    data: {
      type: 5000,
      info: {
              text: result
            }
        }
  };
}

async function processAsync(botReplyPromise, receivedName, groupName) {
  const botReply = await botReplyPromise;
  // Handle the botReply result asynchronously
  // For example, sending result to a webhook
  const asyncResponse = {
       socketType: 2,
       list: [{
           type: 203,
           titleList: [groupName], // Replace with actual names
           receivedContent: botReply.result,// Use the result from botReply
    atList: [receivedName]
          }]
  };

  // Send the asynchronous response to the specified endpoint
  await axios.post('https://api.worktool.ymdyes.cn/wework/sendRawMessage?robotId=wt1do3mp4j4zu7g379aexgfosojp0smq', asyncResponse, {
      headers: {'Content-Type': 'application/json'}
  });

}
