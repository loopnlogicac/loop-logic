import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        int count = 0;
        String line;
        while ((line = reader.readLine()) != null) {
            if (!line.isBlank()) {
                count++;
            }
        }
        System.out.println(count);
    }
}
