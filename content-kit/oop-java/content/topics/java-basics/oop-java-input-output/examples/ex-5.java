import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        System.out.println("Enter one integer per line:");
        String line;
        int total = 0;
        while ((line = reader.readLine()) != null) {
            if (!line.isBlank()) {
                total += Integer.parseInt(line.trim());
            }
        }
        System.out.println(total);
    }
}
