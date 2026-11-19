import javax.swing.SwingUtilities;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JLabel;
import javax.swing.JButton;
import javax.swing.JTextField;
import java.awt.FlowLayout;
import java.awt.GridLayout;
import java.awt.BorderLayout;

class Main {
    public static void main(String[] args) throws Exception {
        SwingUtilities.invokeLater(() -> {
            JFrame frame = new JFrame("Live preview");
            JPanel panel = new JPanel(new FlowLayout());
            JTextField name = new JTextField(12);
            JLabel result = new JLabel("Waiting");
            JButton show = new JButton("Show");
            show.addActionListener(event -> {
                result.setText("Hello " + name.getText().strip());
                frame.pack();
            });
            panel.add(name);
            panel.add(show);
            panel.add(result);
            frame.add(panel);
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.pack();
            frame.setLocationRelativeTo(null);
            frame.setVisible(true);
        });
    }
}
