const AppController = require('../../controller/AppController');

const extractSubstring = require('../../scripts/extractSubstring');
const deleteMessage = require('../../scripts/deleteMessage');
const reportError = require('../../scripts/reportError');
const reply = require('../../scripts/reply');
const DatabaseQuerys = require('../../controller/DatabaseQuerys');

async function onCallbackQuery(ctx) {
  const userID = ctx.from.id;
  const prefix = ctx.update.callback_query.data.substring(0, 3);
  const databaseId = extractSubstring(ctx.update.callback_query.data, 'db_', 'dt_');
  /**
  * * "db_" = database selection
  * * "pr_" = propierty selection
  * * "vl_" = value selection
  */

  if (ctx.session.waitingForDefaultDatabaseSelection) {
    const response = await DatabaseQuerys().addDefaultDatabase(databaseId, ctx?.from?.id);
    reply(ctx, `Added the database <strong>${response.data.defaultDatabaseName}</strong> as default`);
    deleteMessage(ctx, ctx.update.callback_query.message.message_id);
    ctx.session.waitingForDefaultDatabaseSelection = false;
    return;
  }

  if (ctx.session.waitingForChangeSortDatabaseSelection) {
    await AppController.t_response(ctx).setSort(userID, databaseId);
    deleteMessage(ctx, ctx.update.callback_query.message.message_id);

    ctx.session.waitingForChangeSortDatabaseSelection = false;
  }

  switch (prefix) {
    case 'db_': {
      await AppController.t_response(ctx).properties(userID);

      // Delete the previous message
      deleteMessage(ctx, ctx.update.callback_query.message.message_id);

      break;
    }

    case 'pr_': {
      const index = extractSubstring(
        ctx.update.callback_query.data,
        'in_',
        false,
      );

      // Check if cancel operation button is pressed
      const operation = extractSubstring(ctx.update.callback_query.data, 'pr_', 'in_');
      if (operation === 'co_') {
        reply(ctx, 'Operation canceled', { parse_mode: 'HTML' });
        ctx.session.dataForAdd[index] = null;
        // Delete the previous message
        deleteMessage(ctx, ctx.update.callback_query.message.message_id);
        return;
      }

      // Check if send button is pressed
      if (operation === 'sd_') {
        // Get data
        const data = ctx.session.dataForAdd[index];

        if (!data) {
          reportError(ctx);
          return;
        }

        let response;

        if (data === undefined) {
          reportError(ctx);
          return;
        }

        const message = {};

        switch (data.type) {
          case 'text': {
            // Get what text want the user add
            const text = data.data.title;

            response = await AppController.notion.addMessageToDatabase(
              userID,
              data.databaseID,
              data,
            );

            if (response.status !== 'error') {
              message.text = `<strong>${
                text.length > 20 ? `${text}\n\n</strong>` : `${text}</strong> `
              }added to <strong>${response.databaseTitle}</strong> database 👍`;
              message.data = { parse_mode: 'HTML' };
            }

            break;
          }

          case 'image':
            // Get what image want the user add
            // eslint-disable-next-line no-case-declarations
            const image = data.data;
            image.title = image.title ? image.title : image.file_path;

            response = await AppController.notion.addImageToDatabase(
              userID,
              data.databaseID,
              `https://api.telegram.org/file/bot${process.env.NODE_ENV === 'production' ? process.env.BOT_TOKEN_PROD : process.env.BOT_TOKEN_DEV}/${image.file_path}`,
              image.title,
              data.propertiesValues,
            );

            if (response.status !== 'error') {
              message.text = `<strong>${
                image.title.length > 20
                  ? `${image.title}\n\n</strong>`
                  : `${image.title}</strong> `
              }added to <strong>${response.databaseTitle}</strong> database 👍`;
              message.data = { parse_mode: 'HTML' };
            }

            break;

          default:
            reportError(ctx);
            break;
        }

        reply(ctx, message.text, message.data);

        // Change this data on array for null
        ctx.session.dataForAdd[index] = null;

        // Report in error case
        if (response.status === 'error') {
          deleteMessage(ctx, ctx.update.callback_query.message.message_id);
          reportError(ctx);
          return;
        }

        // Delete DB selector
        deleteMessage(ctx, ctx.update.callback_query.message.message_id);

        return;
      }

      if (operation === 'rd_' || operation === 'ds_') {
        const databases = await AppController.notion.getDatabases(ctx?.from?.id);
        const text = ctx.session.dataForAdd[index].data.title;
        const botReply = text.length > 20 ? `\n\n${text}` : text;
        const keyboard = AppController.generateKeyboard.databases(databases.results, null, 'text', ctx.session.dataForAdd);

        deleteMessage(ctx, ctx.update.callback_query.message.message_id);
        try {
          if (operation === 'rd_') {
            const response = await DatabaseQuerys().removeDefaultDatabase(ctx?.from?.id);
            if (response.status === 'error') {
              deleteMessage(ctx, ctx.update.callback_query.message.message_id);
              reportError(ctx);
              return;
            }
            await reply(ctx, `Removed <strong>${response.data.defaultDatabaseName}</strong> as default database`);
          }
          await reply(ctx, `Select the <strong>database</strong> to save <strong>${botReply}</strong>`, { ...keyboard, parse_mode: 'HTML' });
        } catch (err) {
          console.log(err);
        }
        return;
      }

      await AppController.t_response(ctx).values();

      // Delete the previous message
      deleteMessage(ctx, ctx.update.callback_query.message.message_id);

      break;
    }

    case 'vl_': {
      // Get data index
      const index = parseInt(
        extractSubstring(ctx.update.callback_query.data, 'pi_', ''),
        10,
      );

      // If done or cancel operation button pressed
      if (
        extractSubstring(ctx.update.callback_query.data, 'vl_', 'pi_') === 'dn_'
      ) {
        // Set false in the case that the app was waiting for a value
        ctx.session.waitingForPropiertyValue = false;

        // Delete the previous message
        await deleteMessage(ctx, ctx.update.callback_query.message.message_id);

        AppController.t_response(ctx).properties(
          userID,
          ctx.session.dataForAdd[index].listOfpropertiesQuery,
        );
        return;
      }

      // Get propierty id
      const propiertyID = extractSubstring(
        ctx.update.callback_query.data,
        'pr_',
        'pi_',
      );

      // Get propierty data
      const propierty = Object.values(
        ctx.session.dataForAdd[index].properties,
      ).find((prop) => prop.id === propiertyID);

      // Get optionID
      const optionID = extractSubstring(
        ctx.update.callback_query.data,
        'vl_',
        'pr_',
      );

      // If not exists the properties values propierty, create it
      if (!ctx.session.dataForAdd[index].propertiesValues) {
        ctx.session.dataForAdd[index].propertiesValues = {};
      }

      const propiertyValue = ctx.session.dataForAdd[index].propertiesValues[propiertyID];

      const message = {};

      switch (propierty.type) {
        case 'multi_select': {
          // Get data
          const data = propierty.multi_select.options.find(
            (option) => option.id === optionID,
          );

          if (propiertyValue) {
            // If the array don't include the propierty id, add it
            if (
              !Object.keys(
                ctx.session.dataForAdd[index].propertiesValues[propiertyID],
              ).includes(data)
            ) {
              ctx.session.dataForAdd[index].propertiesValues[propiertyID] = [
                ...propiertyValue,
                data,
              ];
            }
          } else {
            ctx.session.dataForAdd[index].propertiesValues[propiertyID] = [
              data,
            ];
          }

          message.text = `<strong>${data.name}</strong> value added`;
          message.data = { parse_mode: 'HTML' };

          break;
        }

        case 'checkbox': {
          // Get the boolean of the optionID
          const propertyData = JSON.parse(optionID);

          // Add it to the values
          ctx.session.dataForAdd[index].propertiesValues[propiertyID] = propertyData;

          // Reply
          message.text = `<strong>${propierty.name}</strong> is <strong>${
            propertyData ? 'checked' : 'unchecked'
          }</strong>`;
          message.data = { parse_mode: 'HTML' };

          // Delete the checked selector
          await deleteMessage(
            ctx,
            ctx.update.callback_query.message.message_id,
          );

          // Reply with properties list
          AppController.t_response(ctx).properties(
            userID,
            ctx.session.dataForAdd[index].listOfpropertiesQuery,
          );

          break;
        }

        case 'select': {
          // Get data
          const data = propierty.select.options.find(
            (option) => option.id === optionID,
          );

          ctx.session.dataForAdd[index].propertiesValues[propiertyID] = data;

          // Reply
          message.text = `<strong>${data.name}</strong> value added`;
          message.data = { parse_mode: 'HTML' };

          // Delete the checked selector
          await deleteMessage(
            ctx,
            ctx.update.callback_query.message.message_id,
          );

          // Reply with properties list
          AppController.t_response(ctx).properties(
            userID,
            ctx.session.dataForAdd[index].listOfpropertiesQuery,
          );
          break;
        }

        default:
          reportError(ctx);
          break;
      }

      reply(ctx, message.text, message.data);

      break;
    }

    default:
      reportError(ctx);
      break;
  }
}

module.exports = onCallbackQuery;
