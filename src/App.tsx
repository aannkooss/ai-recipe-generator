import { useState } from "react";
import "./App.css";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import {
  Button,
  Flex,
  Heading,
  Text,
  TextField,
  View,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

function App() {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getRecipe = async () => {
    if (!ingredients) {
      return;
    }
    setLoading(true);
    setRecipe(null);
    try {
      const { data, errors } = await client.queries.askBedrock({
        ingredients: ingredients.split(",").map((i) => i.trim()),
      });
      if (errors) {
        console.error("Error getting recipe:", errors);
        setRecipe("Error generating recipe. Please check the console.");
      } else {
        setRecipe(data?.body ?? "No recipe found.");
      }
    } catch (error) {
      console.error("Error getting recipe:", error);
      setRecipe("Error generating recipe. Please check the console.");
    }
    setLoading(false);
  };

  return (
    <View
      textAlign="center"
      padding="medium"
      width="80%"
      maxWidth="800px"
      margin="0 auto"
    >
      <Heading level={1}>Meet Your Personal</Heading>
      <Heading level={2} color="blue.60">
        Recipe AI
      </Heading>
      <Text>
        Simply type a few ingredients using the format ingredient1, ingredient2,
        etc., and Recipe AI will generate an all-new recipe on demand...
      </Text>
      <Flex as="form" direction="column" gap="medium" marginTop="medium">
                <TextField
          label="Ingredients"
          labelHidden
          placeholder="Ingredient1, Ingredient2, Ingredient3,...etc"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <Button
          type="button"
          onClick={getRecipe}
          isLoading={loading}
          variation="primary"
          loadingText="Generating..."
        >
          Generate
        </Button>
      </Flex>
      {recipe && (
        <View
          marginTop="medium"
          padding="medium"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="medium"
        >
          <Heading level={3}>Recipe Suggestion</Heading>
          <Text>{recipe}</Text>
        </View>
      )}
    </View>
  );
}

export default App;
